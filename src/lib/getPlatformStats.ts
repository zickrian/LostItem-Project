export async function getPlatformStats() {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_platform_stats`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Bad status ' + res.status);
  const json = await res.json();
  return {
    hilang: Number(json?.BarangHilangDilaporkan ?? 0),
    ditemukan: Number(json?.BarangDitemukan ?? 0),
    diklaim: Number(json?.BarangDiklaim ?? 0),
  };
}

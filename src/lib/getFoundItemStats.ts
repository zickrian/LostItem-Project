export async function getFoundItemStats() {
  // Safety check for environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in getFoundItemStats');
    return {
      'STNK': 0,
      'Handphone': 0,
      'Buku': 0,
      'Kunci': 0,
      'Dompet': 0,
      'Laptop': 0,
    };
  }

  const url = `${supabaseUrl}/rest/v1/rpc/get_found_item_totals`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Bad status ' + res.status);
  const json = await res.json();
  const cats = ['STNK','Handphone','Buku','Kunci','Dompet','Laptop'] as const;
  const out: Record<string, number> = {};
  for (const c of cats) out[c] = Number(json?.[c] ?? 0); // default 0
  return out;
}

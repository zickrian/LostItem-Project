export type Totals = Record<'STNK'|'Handphone'|'Buku'|'Kunci'|'Dompet'|'Laptop', number>;

export async function getFoundItemTotals(): Promise<Totals> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Safety check for environment variables
  if (!base || !key) {
    console.warn('⚠️ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in getFoundItemTotals');
    return { STNK:0, Handphone:0, Buku:0, Kunci:0, Dompet:0, Laptop:0 };
  }

  const res = await fetch(`${base}/rest/v1/rpc/get_found_item_totals`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    cache: 'no-store'
  });
  const raw = await res.text();
  if (!res.ok) throw new Error(`get_found_item_totals ${res.status}: ${raw}`);
  const j = raw ? JSON.parse(raw) : {};
  const cats = ['STNK','Handphone','Buku','Kunci','Dompet','Laptop'] as const;
  const out: Totals = { STNK:0, Handphone:0, Buku:0, Kunci:0, Dompet:0, Laptop:0 };
  for (const c of cats) out[c] = Number(j?.[c] ?? 0);
  return out;
}

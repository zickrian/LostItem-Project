export async function getFoundItemStats() {
const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_found_item_totals`;
const res = await fetch(url, {
method: 'POST',
headers: {
apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
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

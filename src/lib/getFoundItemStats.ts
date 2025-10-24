export async function getFoundItemStats() {
  // Safety check for environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in getFoundItemStats');
    return {
      'Elektronik': 0,
      'Dokumen': 0,
      'Kunci': 0,
      'Tas & Dompet': 0,
      'Buku & Alat Tulis': 0,
      'Aksesoris': 0,
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
  if (!res.ok) {
    console.error('❌ getFoundItemStats API Error:', res.status, res.statusText);
    const errorText = await res.text();
    console.error('❌ Error response:', errorText);
    throw new Error(`getFoundItemStats ${res.status}: ${errorText}`);
  }
  const json = await res.json();
  console.log('📊 Found Item Stats Response:', json);
  
  const cats = ['Elektronik','Dokumen','Kunci','Tas & Dompet','Buku & Alat Tulis','Aksesoris'] as const;
  const out: Record<string, number> = {};
  for (const c of cats) out[c] = Number(json?.[c] ?? 0); // default 0
  return out;
}

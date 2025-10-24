export async function getPlatformStats() {
  // Safety check for environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in getPlatformStats');
    return {
      hilang: 0,
      ditemukan: 0,
      diklaim: 0,
    };
  }

  const url = `${supabaseUrl}/rest/v1/rpc/get_platform_stats`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Bad status ' + res.status);
  const json = await res.json();
  console.log('📊 Platform Stats Response:', json);
  
  return {
    hilang: Number(json?.reported ?? 0),
    ditemukan: Number(json?.found ?? 0),
    diklaim: Number(json?.claimed ?? 0),
  };
}

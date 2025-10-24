export type FoundItem = {
  id: string;
  name: string;
  category: string;
  location: string;
  found_date: string;
};

export async function getFoundItems(): Promise<FoundItem[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Safety check for environment variables
    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in getFoundItems');
      return [];
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/get_found_items`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      cache: 'no-store',

    });
    if (!res.ok) {
      if (res.status === 404) {
        console.warn('get_found_items function not found, returning empty array');
        return [];
      }
      console.warn(`get_found_items API error: ${res.status} ${res.statusText}, returning empty array`);
      return [];
    }
    const json = await res.json();

    // Normalisasi data, pastikan array valid dan map ke FoundItem
    if (Array.isArray(json)) {
      return json.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        location: item.location,
        found_date: item.found_date,
      }));
    }
    return [];
  } catch (err) {
    console.error('getFoundItems error:', err);
    return [];
  }
}

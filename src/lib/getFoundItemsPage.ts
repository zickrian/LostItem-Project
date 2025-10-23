export type FoundItem = {
  id: string;
  name: string;
  category: string;
  location: string;
  found_date: string;
};

export type FoundItemsPage = {
  items: FoundItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getFoundItemsPage(page = 1, limit = 6): Promise<FoundItemsPage> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  // Gunakan RPC yang ada: get_found_items_paged (filter: type='temuan', status='aktif' dikerjakan di SQL fungsi itu).
  const url = `${base}/rest/v1/rpc/get_found_items_paged`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ limit_rows: Number(limit), page_no: Number(page) }),
    cache: 'no-store',
  });

  const raw = await res.text();
  if (!res.ok) throw new Error(`get_found_items_paged ${res.status}: ${raw}`);

  const json = raw ? JSON.parse(raw) : {};
  const total = Number(json?.total ?? 0);
  const items = Array.isArray(json?.items) ? json.items : [];

  return { items, total, page, limit, totalPages: Math.ceil(total / (limit || 1)) };
}

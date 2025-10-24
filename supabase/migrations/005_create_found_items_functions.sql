-- Function to get found items (temuan)
create or replace function get_found_items()
returns json as $$
declare
  result json;
begin
  select json_agg(
    json_build_object(
      'id', r.id,
      'name', r.title,
      'category', r.category,
      'location', r.location,
      'found_date', r.created_at
    )
  ) into result
  from public.reports r
  where r.type = 'temuan' and r.status = 'aktif'
  order by r.created_at desc
  limit 10;

  -- Return empty array if no results
  if result is null then
    return '[]'::json;
  end if;

  return result;
end;
$$ language plpgsql security definer;

-- Function to get found item stats by category
create or replace function get_found_item_stats()
returns json as $$
declare
  result json;
begin
  select json_build_object(
    'Dompet', coalesce(sum(case when category = 'Dompet' then 1 else 0 end), 0),
    'Handphone', coalesce(sum(case when category = 'Handphone' then 1 else 0 end), 0),
    'Buku', coalesce(sum(case when category = 'Buku' then 1 else 0 end), 0),
    'Kunci', coalesce(sum(case when category = 'Kunci' then 1 else 0 end), 0),
    'STNK', coalesce(sum(case when category = 'STNK' then 1 else 0 end), 0),
    'Laptop', coalesce(sum(case when category = 'Laptop' then 1 else 0 end), 0)
  ) into result
  from public.reports
  where type = 'temuan' and status = 'aktif';

  return result;
end;
$$ language plpgsql security definer;

-- Grant execute permission to authenticated users and anon
grant execute on function get_found_items() to authenticated;
grant execute on function get_found_items() to anon;
grant execute on function get_found_item_stats() to authenticated;
grant execute on function get_found_item_stats() to anon;

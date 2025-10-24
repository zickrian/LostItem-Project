-- Function to get found item totals by category
create or replace function get_found_item_totals()
returns json as $$
declare
  result json;
begin
  select json_build_object(
    'STNK', coalesce(sum(case when category = 'STNK' then 1 else 0 end), 0),
    'Handphone', coalesce(sum(case when category = 'Handphone' then 1 else 0 end), 0),
    'Buku', coalesce(sum(case when category = 'Buku' then 1 else 0 end), 0),
    'Kunci', coalesce(sum(case when category = 'Kunci' then 1 else 0 end), 0),
    'Dompet', coalesce(sum(case when category = 'Dompet' then 1 else 0 end), 0),
    'Laptop', coalesce(sum(case when category = 'Laptop' then 1 else 0 end), 0)
  ) into result
  from public.reports
  where type = 'temuan' and status = 'aktif';

  return result;
end;
$$ language plpgsql security definer;

-- Grant execute permission to authenticated users and anon
grant execute on function get_found_item_totals() to authenticated;
grant execute on function get_found_item_totals() to anon;

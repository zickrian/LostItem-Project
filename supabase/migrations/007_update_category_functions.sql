-- Update function to get found item totals by new category structure
create or replace function get_found_item_totals()
returns json as $$
declare
  result json;
begin
  select json_build_object(
    'Elektronik', coalesce(sum(case when category = 'Elektronik' then 1 else 0 end), 0),
    'Dokumen', coalesce(sum(case when category = 'Dokumen' then 1 else 0 end), 0),
    'Kunci', coalesce(sum(case when category = 'Kunci' then 1 else 0 end), 0),
    'Tas & Dompet', coalesce(sum(case when category = 'Tas & Dompet' then 1 else 0 end), 0),
    'Buku & Alat Tulis', coalesce(sum(case when category = 'Buku & Alat Tulis' then 1 else 0 end), 0),
    'Aksesoris', coalesce(sum(case when category = 'Aksesoris' then 1 else 0 end), 0)
  ) into result
  from public.reports
  where status = 'aktif';

  return result;
end;
$$ language plpgsql security definer;

-- Ensure permissions are set
grant execute on function get_found_item_totals() to authenticated;
grant execute on function get_found_item_totals() to anon;

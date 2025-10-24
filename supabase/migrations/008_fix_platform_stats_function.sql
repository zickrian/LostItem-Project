-- Drop and recreate the function to ensure it returns correct field names
drop function if exists get_platform_stats();

-- Function to get platform statistics
create or replace function get_platform_stats()
returns json as $$
declare
  reported_count integer;
  found_count integer;
  claimed_count integer;
begin
  -- Count total reports with type 'hilang' (reported lost items)
  select count(*) into reported_count
  from public.reports
  where type = 'hilang';

  -- Count total reports with type 'temuan' (found items)
  select count(*) into found_count
  from public.reports
  where type = 'temuan';

  -- Count reports that are marked as 'selesai' (claimed/resolved)
  select count(*) into claimed_count
  from public.reports
  where status = 'selesai';

  -- Return as JSON object with correct field names
  return json_build_object(
    'reported', reported_count,
    'found', found_count,
    'claimed', claimed_count,
    'updatedAt', now()
  );
end;
$$ language plpgsql security definer;

-- Grant execute permission to authenticated users and anon
grant execute on function get_platform_stats() to authenticated;
grant execute on function get_platform_stats() to anon;

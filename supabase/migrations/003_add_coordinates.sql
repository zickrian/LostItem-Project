-- 1) Add coordinate columns with accuracy and timestamp
ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS latitude  DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS accuracy_m DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS reported_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- 2) Add validation constraints for valid coordinate ranges
ALTER TABLE public.reports
  ADD CONSTRAINT reports_lat_range CHECK (latitude IS NULL OR (latitude BETWEEN -90 AND 90)),
  ADD CONSTRAINT reports_lon_range CHECK (longitude IS NULL OR (longitude BETWEEN -180 AND 180));

-- 3) Create index for coordinate-based searches (useful for location filtering)
CREATE INDEX IF NOT EXISTS reports_lat_lon_idx ON public.reports(latitude, longitude);

-- 4) Add comments to describe the columns
COMMENT ON COLUMN public.reports.latitude IS 'Latitude coordinate from user location when report was created';
COMMENT ON COLUMN public.reports.longitude IS 'Longitude coordinate from user location when report was created';
COMMENT ON COLUMN public.reports.accuracy_m IS 'GPS accuracy in meters at the time of location capture';
COMMENT ON COLUMN public.reports.reported_at IS 'Timestamp when the report was actually submitted (may differ from created_at if edited)';

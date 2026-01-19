-- Enable pg_cron and pg_net extensions for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Grant usage to postgres user
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Schedule keep-alive job to run every day at 6:00 AM UTC
SELECT cron.schedule(
  'keep-alive-daily',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://jglcaorqdnczzgviadgy.supabase.co/functions/v1/keep-alive',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnbGNhb3JxZG5jenpndmlhZGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MDEzOTMsImV4cCI6MjA4MjQ3NzM5M30.PibBS1Z7C85Tfvl5BOoeNRBQRya-O6I2PnPnWhd0LyE"}'::jsonb,
    body := '{"source": "cron"}'::jsonb
  ) AS request_id;
  $$
);
-- Migration: Setup pg_cron for keep-alive
-- Created: 2026-01-17
-- Purpose: Prevent database sleep on Supabase Free Tier

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Remove existing job if exists
SELECT cron.unschedule('keep-alive-daily');

-- Schedule keep-alive job to run every 12 hours (at 6:00 AM and 6:00 PM UTC)
-- This ensures database stays active without excessive pings
SELECT cron.schedule(
  'keep-alive-daily',
  '0 6,18 * * *',
  $$
  SELECT net.http_post(
    url := 'https://jglcaorqdnczzgviadgy.supabase.co/functions/v1/keep-alive',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnbGNhb3JxZG5jenpndmlhZGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MDEzOTMsImV4cCI6MjA4MjQ3NzM5M30.PibBS1Z7C85Tfvl5BOoeNRBQRya-O6I2PnPnWhd0LyE"}'::jsonb,
    body := '{"source": "cron"}'::jsonb
  ) AS request_id;
  $$
);

-- Verify the job is scheduled
SELECT * FROM cron.job WHERE jobname = 'keep-alive-daily';

-- Comment: 
-- This creates a cron job that runs every 12 hours (6 AM and 6 PM UTC)
-- Calls the keep-alive edge function to prevent Supabase Free Tier database
-- from going to sleep after inactivity.
-- 
-- Single Server-Side solution - more reliable than client-side pings
-- No need for browser-based keep-alive hooks

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

-- Schedule keep-alive job to run every day at 6:00 AM UTC
-- This will call the edge function to keep database active
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

-- Verify the job is scheduled
SELECT * FROM cron.job WHERE jobname = 'keep-alive-daily';

-- Comment: 
-- This creates a daily cron job that calls the keep-alive edge function
-- to prevent Supabase Free Tier database from going to sleep after inactivity

SELECT cron.schedule(
  'update-results-cron',
  '*/3 13-22 * * *',
  $$
  SELECT net.http_post(
    url := 'https://mpsaxiwzscaekahzwjlq.supabase.co/functions/v1/update-results',
    body := '{}'::jsonb,
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
  $$
);

SELECT cron.schedule(
  'update-odds-cron',
  '0 1 * * *',
  $$
  SELECT net.http_post(
    url := 'https://mpsaxiwzscaekahzwjlq.supabase.co/functions/v1/update-odds',
    body := '{}'::jsonb,
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
  $$
);

-- 1. Enable RLS (Usually enabled by default, safe to run)
alter table storage.objects enable row level security;

-- 2. Drop existing policies to avoid conflicts
drop policy if exists "Allow authenticated uploads" on storage.objects;
drop policy if exists "Allow authenticated updates" on storage.objects;
drop policy if exists "Allow authenticated deletes" on storage.objects;
drop policy if exists "Allow authenticated selects" on storage.objects;

-- 3. Create Upload Policy
create policy "Allow authenticated uploads"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'cloudflare_photoREPO_zrl' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Create Update Policy
create policy "Allow authenticated updates"
on storage.objects for update
to authenticated
using (
  bucket_id = 'cloudflare_photoREPO_zrl' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 5. Create Delete Policy
create policy "Allow authenticated deletes"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'cloudflare_photoREPO_zrl' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 6. Create Select Policy (Viewing)
create policy "Allow authenticated selects"
on storage.objects for select
to authenticated
using (
  bucket_id = 'cloudflare_photoREPO_zrl' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

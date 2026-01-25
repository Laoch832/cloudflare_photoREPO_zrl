-- Enable RLS on objects (idempotent usually)
alter table storage.objects enable row level security;

-- Allow uploads
create policy "Allow authenticated uploads"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'cloudflare_photoREPO_zrl' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow updates
create policy "Allow authenticated updates"
on storage.objects for update
to authenticated
using (
  bucket_id = 'cloudflare_photoREPO_zrl' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow selects (viewing)
create policy "Allow authenticated selects"
on storage.objects for select
to authenticated
using (
  bucket_id = 'cloudflare_photoREPO_zrl' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow deletes
create policy "Allow authenticated deletes"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'cloudflare_photoREPO_zrl' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

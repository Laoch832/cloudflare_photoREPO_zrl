create table if not exists public.featured_images (
  id uuid default gen_random_uuid() primary key,
  url text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) default auth.uid()
);

alter table public.featured_images enable row level security;

create policy "Anyone can read featured images"
  on public.featured_images for select
  using ( true );

create policy "Admins can insert featured images"
  on public.featured_images for insert
  with check ( auth.email() = '2730377018@qq.com' );

create policy "Admins can delete featured images"
  on public.featured_images for delete
  using ( auth.email() = '2730377018@qq.com' );

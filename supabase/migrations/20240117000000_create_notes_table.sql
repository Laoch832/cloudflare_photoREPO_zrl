-- Create notes table
create table if not exists public.notes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) not null,
  is_published boolean default true
);

-- Enable RLS
alter table public.notes enable row level security;

-- Policies
create policy "Anyone can read published notes"
  on public.notes for select
  using ( is_published = true );

create policy "Admins can insert notes"
  on public.notes for insert
  with check ( auth.email() = '2730377018@qq.com' );

create policy "Admins can update their own notes"
  on public.notes for update
  using ( auth.uid() = user_id );

create policy "Admins can delete their own notes"
  on public.notes for delete
  using ( auth.uid() = user_id );

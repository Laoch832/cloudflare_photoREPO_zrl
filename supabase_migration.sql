-- Migration Script for Supabase
-- Goal: Standardize 'notes' table to support both Diary (timeline) and Notes (docs) views

-- 1. Create or Update 'notes' table
create table if not exists public.notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text, -- Used for Document Title or Diary Title
  content text, -- HTML or Text content
  summary text, -- Plain text summary for list views
  mood text, -- Optional: for Diary entries (e.g., 'happy', 'sad')
  weather text, -- Optional: for Diary entries
  tags text[], -- Array of tags
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable RLS (Row Level Security)
alter table public.notes enable row level security;

-- 3. Policies
-- Policy: Everyone can view published notes (if public blog)
create policy "Public notes are viewable by everyone"
  on public.notes for select
  using ( is_published = true );

-- Policy: Users can insert their own notes
create policy "Users can insert their own notes"
  on public.notes for insert
  with check ( auth.uid() = user_id );

-- Policy: Users can update their own notes
create policy "Users can update their own notes"
  on public.notes for update
  using ( auth.uid() = user_id );

-- Policy: Users can delete their own notes
create policy "Users can delete their own notes"
  on public.notes for delete
  using ( auth.uid() = user_id );

-- 4. Migration Helper (Optional: If you need to migrate from a different structure)
-- alter table public.notes add column if not exists summary text;

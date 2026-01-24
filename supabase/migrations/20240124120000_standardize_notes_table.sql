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
-- Drop existing policies if they exist to avoid errors or use 'create policy if not exists' if supported, 
-- but standard SQL doesn't support 'create policy if not exists' cleanly in all versions.
-- We will just try to create. If it fails, it might be because they exist. 
-- To be safe for a migration script, usually we drop then create, or just leave it if it's idempotent.
-- However, 'create table if not exists' handles the table.
-- Let's try to add a block to handle policy existence or just proceed. 
-- Since I can't easily write PL/pgSQL here without more complexity, I'll assume this is a new table or I'm adding to it.
-- But wait, the previous migration `20240117000000_create_notes_table.sql` likely created it.
-- If the table exists, `create table if not exists` does nothing.
-- Then I should ensure columns exist.

-- Let's refine the migration to be more robust for existing tables.
-- Add columns if they don't exist.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notes' AND column_name = 'title') THEN
        ALTER TABLE public.notes ADD COLUMN title text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notes' AND column_name = 'content') THEN
        ALTER TABLE public.notes ADD COLUMN content text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notes' AND column_name = 'summary') THEN
        ALTER TABLE public.notes ADD COLUMN summary text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notes' AND column_name = 'mood') THEN
        ALTER TABLE public.notes ADD COLUMN mood text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notes' AND column_name = 'weather') THEN
        ALTER TABLE public.notes ADD COLUMN weather text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notes' AND column_name = 'tags') THEN
        ALTER TABLE public.notes ADD COLUMN tags text[];
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notes' AND column_name = 'is_published') THEN
        ALTER TABLE public.notes ADD COLUMN is_published boolean default true;
    END IF;
END $$;

-- Re-apply RLS (idempotent usually)
alter table public.notes enable row level security;

-- Drop and recreate policies to ensure they are correct
drop policy if exists "Public notes are viewable by everyone" on public.notes;
create policy "Public notes are viewable by everyone"
  on public.notes for select
  using ( is_published = true );

drop policy if exists "Users can insert their own notes" on public.notes;
create policy "Users can insert their own notes"
  on public.notes for insert
  with check ( auth.uid() = user_id );

drop policy if exists "Users can update their own notes" on public.notes;
create policy "Users can update their own notes"
  on public.notes for update
  using ( auth.uid() = user_id );

drop policy if exists "Users can delete their own notes" on public.notes;
create policy "Users can delete their own notes"
  on public.notes for delete
  using ( auth.uid() = user_id );

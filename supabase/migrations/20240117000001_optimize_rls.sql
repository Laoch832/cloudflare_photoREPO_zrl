-- Drop existing policies to recreate them with optimizations
drop policy if exists "Admins can insert notes" on public.notes;
drop policy if exists "Admins can update their own notes" on public.notes;
drop policy if exists "Admins can delete their own notes" on public.notes;

-- Recreate policies using (select auth.uid()) and (select auth.email()) 
-- This forces Postgres to evaluate the function once per query instead of once per row

create policy "Admins can insert notes"
  on public.notes for insert
  with check ( (select auth.email()) = '2730377018@qq.com' );

create policy "Admins can update their own notes"
  on public.notes for update
  using ( (select auth.uid()) = user_id );

create policy "Admins can delete their own notes"
  on public.notes for delete
  using ( (select auth.uid()) = user_id );

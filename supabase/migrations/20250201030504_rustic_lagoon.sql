/*
  # Fix Storage Permissions

  1. Changes
    - Make receipts bucket public
    - Update policies to allow public access to images
    - Keep upload restrictions to authenticated users only

  2. Security
    - Maintains upload security (only authenticated users)
    - Allows public read access to stored images
*/

-- Update the bucket to be public
update storage.buckets
set public = true
where id = 'receipts';

-- Drop existing policies
drop policy if exists "Users can upload their own receipts" on storage.objects;
drop policy if exists "Users can view their own receipts" on storage.objects;

-- Create new policies for uploads (restricted to authenticated users)
create policy "Users can upload their own receipts"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'receipts' AND
  auth.uid() = owner
);

-- Create new policy for viewing (public access)
create policy "Anyone can view receipts"
on storage.objects for select
using (bucket_id = 'receipts');
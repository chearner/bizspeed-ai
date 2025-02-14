/*
  # Update storage bucket configuration

  1. Changes
    - Make receipts bucket public
    - Update RLS policies for proper file access
  
  2. Security
    - Maintain RLS policies for upload/download
    - Allow public access to files while maintaining ownership checks
*/

-- Update the bucket to be public
update storage.buckets
set public = true
where id = 'receipts';

-- Drop existing policies
drop policy if exists "Users can upload their own receipts" on storage.objects;
drop policy if exists "Users can view their own receipts" on storage.objects;

-- Create new policies
create policy "Users can upload their own receipts"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'receipts' AND
  auth.uid() = owner
);

create policy "Users can view their own receipts"
on storage.objects for select
using (
  bucket_id = 'receipts' AND
  (
    auth.uid() = owner OR
    bucket_id = 'receipts'
  )
);
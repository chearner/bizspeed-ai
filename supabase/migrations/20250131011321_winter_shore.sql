/*
  # Create Storage Bucket for Receipts

  1. Storage Setup
    - Creates a new storage bucket named 'receipts' for storing receipt images
    - Enables public access for authenticated users
  
  2. Security
    - Adds policies to allow authenticated users to:
      - Upload their own receipts
      - View their own receipts
    - Prevents unauthorized access
*/

-- Create the storage bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', false)
on conflict (id) do nothing;

-- Policy to allow authenticated users to upload files
create policy "Users can upload their own receipts"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'receipts' AND
  auth.uid() = owner
);

-- Policy to allow authenticated users to read their own files
create policy "Users can view their own receipts"
on storage.objects for select
to authenticated
using (
  bucket_id = 'receipts' AND
  auth.uid() = owner
);
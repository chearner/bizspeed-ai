/*
  # Add delete policy for receipts

  1. Changes
    - Add policy to allow users to delete their own receipts
*/

-- Create policy to allow users to delete their own receipts
create policy "Users can delete their own receipts"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'receipts' AND
  auth.uid() = owner
);
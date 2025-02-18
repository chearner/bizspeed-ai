/*
  # Add delete policy for bols

  1. Changes
    - Add policy to allow users to delete their own bols
*/

-- Create policy to allow users to delete their own bols
create policy "Users can delete their own bols"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'bols' AND
  auth.uid() = owner
);
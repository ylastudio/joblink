-- Allow anyone to upload CVs to the candidate-cvs bucket
CREATE POLICY "Anyone can upload CVs"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'candidate-cvs');

-- Allow anyone to read CVs (bucket is public)
CREATE POLICY "Anyone can read CVs"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'candidate-cvs');

-- Allow anyone to update their uploaded CVs
CREATE POLICY "Anyone can update CVs"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'candidate-cvs');

-- Allow anyone to delete CVs (for re-uploads)
CREATE POLICY "Anyone can delete CVs"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'candidate-cvs');
-- Upgrade the gallery table to support multiple image uploads in a single entry
ALTER TABLE public.gallery
ADD COLUMN image_urls text[] DEFAULT '{}'::text[];

-- Migrate existing single images into the new array column for backwards compatibility
UPDATE public.gallery 
SET image_urls = ARRAY[image_url] 
WHERE image_url IS NOT NULL;

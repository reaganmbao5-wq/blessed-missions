-- Add the video_type column to the highlights table to differentiate between full Sermons and short Highlights
ALTER TABLE public.highlights 
ADD COLUMN video_type text DEFAULT 'sermon' NOT NULL;

-- If you want to check your existing entries, they will default to 'sermon'.
-- The application will now use three distinct types:
-- 'sermon' -> Shows ONLY on the /sermons page
-- 'highlight' -> Shows ONLY on the /highlights page
-- 'both' -> Shows on BOTH pages (when you tick the "Also post as Highlight" checkbox)

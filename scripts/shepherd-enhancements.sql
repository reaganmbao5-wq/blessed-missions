-- Script to augment the visitors table with Pastoral Follow-Up features

ALTER TABLE public.visitors 
ADD COLUMN IF NOT EXISTS follow_up_status text DEFAULT 'not_contacted',
ADD COLUMN IF NOT EXISTS notes text DEFAULT '';

-- We also make sure the `is_featured` exists on gallery and highlights (Sermons) 
-- just in case it was missed during initial creation.
ALTER TABLE public.gallery
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

ALTER TABLE public.highlights
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

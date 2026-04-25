-- Add the new classification column to distinguish visitors from new souls
ALTER TABLE public.visitors 
ADD COLUMN IF NOT EXISTS is_new_soul BOOLEAN DEFAULT false;

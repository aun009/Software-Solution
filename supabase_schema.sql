-- ============================================================================
-- Supabase Schema Update: Dynamic Category & Subcategory Management
-- ============================================================================

-- 1. Migrate Category Name: Rename 'SEO & Marketing' to 'Marketing' in existing products
UPDATE public.products 
SET category = 'Marketing' 
WHERE category = 'SEO & Marketing';

-- 2. Add 'subcategory' column to the 'products' table if it doesn't exist
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS subcategory TEXT;

-- 2b. Add 'sort_order' column for the admin drag-and-drop ordering
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS sort_order INTEGER;

-- 2c. Add 'cta_link' column for custom affiliate/partner buy links per product
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS cta_link TEXT;

-- 3. Create the 'subcategories' table to store dynamic subcategory listings
CREATE TABLE IF NOT EXISTS public.subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    parent_category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_subcategory_per_parent UNIQUE (name, parent_category)
);

-- 4. Enable Row Level Security (RLS) on 'subcategories'
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

-- 5. Row Level Security Policies for the 'subcategories' table

DROP POLICY IF EXISTS "Allow public read access to subcategories" ON public.subcategories;
DROP POLICY IF EXISTS "Allow authenticated users to insert subcategories" ON public.subcategories;
DROP POLICY IF EXISTS "Allow authenticated users to update subcategories" ON public.subcategories;
DROP POLICY IF EXISTS "Allow authenticated users to delete subcategories" ON public.subcategories;

-- Policy: Allow read access to everyone (public/anonymous and authenticated)
CREATE POLICY "Allow public read access to subcategories" 
ON public.subcategories 
FOR SELECT 
USING (true);

-- Policy: Allow insert/update/delete access to authenticated users (admin role)
CREATE POLICY "Allow authenticated users to insert subcategories" 
ON public.subcategories 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update subcategories" 
ON public.subcategories 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete subcategories" 
ON public.subcategories 
FOR DELETE 
TO authenticated 
USING (true);

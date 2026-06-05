-- Fix RLS policies for installations table to allow users to view their own installations
-- This migration ensures that the client-side query can access the installations

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own installations" ON installations;
DROP POLICY IF EXISTS "Admins can view all installations" ON installations;
DROP POLICY IF EXISTS "Service role can manage everything" ON installations;
DROP POLICY IF EXISTS "Allow anon read for installations" ON installations;
DROP POLICY IF EXISTS "Allow authenticated users to read their installations" ON installations;

-- Create new policies

-- 1. Allow authenticated users to view their own installations
CREATE POLICY "Allow authenticated users to read their installations"
ON installations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 2. Allow admins to view all installations
CREATE POLICY "Admins can view all installations"
ON installations
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- 3. Allow service role to manage everything (for API calls)
CREATE POLICY "Service role can manage everything"
ON installations
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 4. Allow anon to insert/update (for app registration before login)
CREATE POLICY "Allow anon to insert installations"
ON installations
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow anon to update installations"
ON installations
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

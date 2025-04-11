
-- Add emergency contact and healthcare provider fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS healthcare_provider_name TEXT,
ADD COLUMN IF NOT EXISTS healthcare_provider_phone TEXT;

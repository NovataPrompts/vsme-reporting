
-- Add a unique constraint on user_id to allow upsert operations
ALTER TABLE public.company_profiles 
ADD CONSTRAINT company_profiles_user_id_unique UNIQUE (user_id);

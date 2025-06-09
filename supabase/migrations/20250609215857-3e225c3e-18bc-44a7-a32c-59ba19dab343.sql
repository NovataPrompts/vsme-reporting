
-- First, create the Novata organization
INSERT INTO public.organizations (name) 
VALUES ('Novata');

-- Get the organization ID and user IDs, then add both users to the organization
WITH org_data AS (
  SELECT id as org_id FROM public.organizations WHERE name = 'Novata'
),
demo_users AS (
  SELECT id as user_id, email FROM auth.users 
  WHERE email IN ('demo@novata.com', 'novata+demo@novata.com')
)
INSERT INTO public.user_organizations (user_id, organization_id, role)
SELECT 
  demo_users.user_id, 
  org_data.org_id,
  CASE 
    WHEN demo_users.email = 'demo@novata.com' THEN 'admin'
    ELSE 'member'
  END as role
FROM demo_users 
CROSS JOIN org_data;

-- Update existing data to be associated with the organization
-- Update company profiles
UPDATE public.company_profiles 
SET organization_id = (SELECT id FROM public.organizations WHERE name = 'Novata')
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('demo@novata.com', 'novata+demo@novata.com')
);

-- Update VSME user responses
UPDATE public.vsme_user_responses 
SET organization_id = (SELECT id FROM public.organizations WHERE name = 'Novata')
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('demo@novata.com', 'novata+demo@novata.com')
);

-- Update tabular data
UPDATE public.tabular_data 
SET organization_id = (SELECT id FROM public.organizations WHERE name = 'Novata')
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('demo@novata.com', 'novata+demo@novata.com')
);

-- Update disclosure responses
UPDATE public.disclosure_responses 
SET organization_id = (SELECT id FROM public.organizations WHERE name = 'Novata')
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('demo@novata.com', 'novata+demo@novata.com')
);

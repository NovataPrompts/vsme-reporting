
-- Create organizations table
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_organizations junction table for many-to-many relationship
CREATE TABLE public.user_organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member', -- 'admin', 'member'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, organization_id)
);

-- Add organization_id to existing tables that need to be shared
ALTER TABLE public.company_profiles ADD COLUMN organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.vsme_user_responses ADD COLUMN organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.tabular_data ADD COLUMN organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.disclosure_responses ADD COLUMN organization_id UUID REFERENCES public.organizations(id);

-- Enable RLS on new tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_organizations ENABLE ROW LEVEL SECURITY;

-- RLS policies for organizations
CREATE POLICY "Users can view organizations they belong to" 
  ON public.organizations 
  FOR SELECT 
  USING (
    id IN (
      SELECT organization_id 
      FROM public.user_organizations 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Organization admins can update organizations" 
  ON public.organizations 
  FOR UPDATE 
  USING (
    id IN (
      SELECT organization_id 
      FROM public.user_organizations 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS policies for user_organizations
CREATE POLICY "Users can view their own organization memberships" 
  ON public.user_organizations 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Organization admins can manage memberships" 
  ON public.user_organizations 
  FOR ALL 
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM public.user_organizations 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Update existing RLS policies to include organization-based access
-- Company profiles: users can access profiles within their organization
DROP POLICY IF EXISTS "Users can view their own company profile" ON public.company_profiles;
DROP POLICY IF EXISTS "Users can create their own company profile" ON public.company_profiles;
DROP POLICY IF EXISTS "Users can update their own company profile" ON public.company_profiles;
DROP POLICY IF EXISTS "Users can delete their own company profile" ON public.company_profiles;

CREATE POLICY "Users can view company profiles in their organization" 
  ON public.company_profiles 
  FOR SELECT 
  USING (
    user_id = auth.uid() OR 
    organization_id IN (
      SELECT organization_id 
      FROM public.user_organizations 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create company profiles" 
  ON public.company_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update company profiles in their organization" 
  ON public.company_profiles 
  FOR UPDATE 
  USING (
    user_id = auth.uid() OR 
    organization_id IN (
      SELECT organization_id 
      FROM public.user_organizations 
      WHERE user_id = auth.uid()
    )
  );

-- VSME user responses: users can access responses within their organization
DROP POLICY IF EXISTS "Users can view their own responses" ON public.vsme_user_responses;
DROP POLICY IF EXISTS "Users can create their own responses" ON public.vsme_user_responses;
DROP POLICY IF EXISTS "Users can update their own responses" ON public.vsme_user_responses;
DROP POLICY IF EXISTS "Users can delete their own responses" ON public.vsme_user_responses;

CREATE POLICY "Users can view responses in their organization" 
  ON public.vsme_user_responses 
  FOR SELECT 
  USING (
    user_id = auth.uid() OR 
    organization_id IN (
      SELECT organization_id 
      FROM public.user_organizations 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create responses" 
  ON public.vsme_user_responses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update responses in their organization" 
  ON public.vsme_user_responses 
  FOR UPDATE 
  USING (
    user_id = auth.uid() OR 
    organization_id IN (
      SELECT organization_id 
      FROM public.user_organizations 
      WHERE user_id = auth.uid()
    )
  );

-- Tabular data: users can access data within their organization
DROP POLICY IF EXISTS "Users can view their own tabular data" ON public.tabular_data;
DROP POLICY IF EXISTS "Users can create their own tabular data" ON public.tabular_data;
DROP POLICY IF EXISTS "Users can update their own tabular data" ON public.tabular_data;
DROP POLICY IF EXISTS "Users can delete their own tabular data" ON public.tabular_data;

CREATE POLICY "Users can view tabular data in their organization" 
  ON public.tabular_data 
  FOR SELECT 
  USING (
    user_id = auth.uid() OR 
    organization_id IN (
      SELECT organization_id 
      FROM public.user_organizations 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create tabular data" 
  ON public.tabular_data 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update tabular data in their organization" 
  ON public.tabular_data 
  FOR UPDATE 
  USING (
    user_id = auth.uid() OR 
    organization_id IN (
      SELECT organization_id 
      FROM public.user_organizations 
      WHERE user_id = auth.uid()
    )
  );

-- Disclosure responses: users can access responses within their organization
DROP POLICY IF EXISTS "Users can view their own disclosure responses" ON public.disclosure_responses;
DROP POLICY IF EXISTS "Users can create their own disclosure responses" ON public.disclosure_responses;
DROP POLICY IF EXISTS "Users can update their own disclosure responses" ON public.disclosure_responses;
DROP POLICY IF EXISTS "Users can delete their own disclosure responses" ON public.disclosure_responses;

CREATE POLICY "Users can view disclosure responses in their organization" 
  ON public.disclosure_responses 
  FOR SELECT 
  USING (
    user_id = auth.uid() OR 
    organization_id IN (
      SELECT organization_id 
      FROM public.user_organizations 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create disclosure responses" 
  ON public.disclosure_responses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update disclosure responses in their organization" 
  ON public.disclosure_responses 
  FOR UPDATE 
  USING (
    user_id = auth.uid() OR 
    organization_id IN (
      SELECT organization_id 
      FROM public.user_organizations 
      WHERE user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_user_organizations_user_id ON public.user_organizations(user_id);
CREATE INDEX idx_user_organizations_organization_id ON public.user_organizations(organization_id);
CREATE INDEX idx_company_profiles_organization_id ON public.company_profiles(organization_id);
CREATE INDEX idx_vsme_user_responses_organization_id ON public.vsme_user_responses(organization_id);
CREATE INDEX idx_tabular_data_organization_id ON public.tabular_data(organization_id);
CREATE INDEX idx_disclosure_responses_organization_id ON public.disclosure_responses(organization_id);

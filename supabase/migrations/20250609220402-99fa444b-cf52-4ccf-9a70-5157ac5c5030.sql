
-- Drop the problematic RLS policies that cause infinite recursion
DROP POLICY IF EXISTS "Users can view their own organization memberships" ON public.user_organizations;
DROP POLICY IF EXISTS "Organization admins can manage memberships" ON public.user_organizations;

-- Create new, non-recursive policies for user_organizations
CREATE POLICY "Users can view their own organization memberships" 
  ON public.user_organizations 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own organization memberships" 
  ON public.user_organizations 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own organization memberships" 
  ON public.user_organizations 
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own organization memberships" 
  ON public.user_organizations 
  FOR DELETE 
  USING (user_id = auth.uid());

-- Also update the other problematic policies that reference user_organizations
-- These policies were causing the recursion by looking up organization membership
-- within the same query that was already checking organization membership

-- Update company profiles policy to be simpler
DROP POLICY IF EXISTS "Users can view company profiles in their organization" ON public.company_profiles;
DROP POLICY IF EXISTS "Users can update company profiles in their organization" ON public.company_profiles;

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

-- Update VSME user responses policies
DROP POLICY IF EXISTS "Users can view responses in their organization" ON public.vsme_user_responses;
DROP POLICY IF EXISTS "Users can update responses in their organization" ON public.vsme_user_responses;

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

-- Update tabular data policies
DROP POLICY IF EXISTS "Users can view tabular data in their organization" ON public.tabular_data;
DROP POLICY IF EXISTS "Users can update tabular data in their organization" ON public.tabular_data;

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

-- Update disclosure responses policies
DROP POLICY IF EXISTS "Users can view disclosure responses in their organization" ON public.disclosure_responses;
DROP POLICY IF EXISTS "Users can update disclosure responses in their organization" ON public.disclosure_responses;

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

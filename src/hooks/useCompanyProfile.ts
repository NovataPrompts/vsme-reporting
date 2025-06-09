
import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CompanyProfile {
  id?: string;
  name: string;
  company_structure: string;
  dba_name: string;
  year_of_incorporation: number | null;
  company_description: string;
  website: string;
  country_of_domicile: string;
  primary_currency: string;
  fiscal_year_end: string | null;
  organization_id?: string;
}

export const useCompanyProfile = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const getCompanyProfile = useCallback(async () => {
    try {
      console.log('Fetching company profile...');
      
      // First try to get the user's own profile
      let { data, error } = await supabase
        .from('company_profiles')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user company profile:', error);
        throw error;
      }

      // If user has their own profile, return it
      if (data) {
        console.log('Found user company profile:', data);
        return data;
      }

      // If no personal profile, check for organization profile
      console.log('No personal profile found, checking for organization profile...');
      
      // Get user's organization
      const { data: userOrg, error: orgError } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .maybeSingle();

      if (orgError) {
        console.error('Error fetching user organization:', orgError);
        return null;
      }

      if (!userOrg?.organization_id) {
        console.log('User has no organization');
        return null;
      }

      // Look for any company profile in the same organization
      const { data: orgProfile, error: orgProfileError } = await supabase
        .from('company_profiles')
        .select('*')
        .eq('organization_id', userOrg.organization_id)
        .maybeSingle();

      if (orgProfileError) {
        console.error('Error fetching organization company profile:', orgProfileError);
        return null;
      }

      if (orgProfile) {
        console.log('Found organization company profile:', orgProfile);
        return {
          ...orgProfile,
          id: undefined, // Remove ID so it creates a new record for this user
          user_id: undefined // Will be set when saving
        };
      }

      console.log('No company profile found');
      return null;
    } catch (error) {
      console.error('Error loading company profile:', error);
      return null;
    }
  }, []);

  const saveCompanyProfile = useCallback(async (profile: Omit<CompanyProfile, 'id'>) => {
    setIsLoading(true);
    try {
      console.log('Starting to save company profile...');
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      console.log('User authenticated, user ID:', user.user.id);

      // Get user's organization
      const { data: userOrg } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', user.user.id)
        .maybeSingle();

      const profileData = {
        user_id: user.user.id,
        name: profile.name,
        company_structure: profile.company_structure,
        dba_name: profile.dba_name,
        year_of_incorporation: profile.year_of_incorporation,
        company_description: profile.company_description,
        website: profile.website,
        country_of_domicile: profile.country_of_domicile,
        primary_currency: profile.primary_currency,
        fiscal_year_end: profile.fiscal_year_end,
        organization_id: userOrg?.organization_id || null,
        updated_at: new Date().toISOString()
      };

      console.log('Final data being saved to Supabase:', profileData);

      const { data, error } = await supabase
        .from('company_profiles')
        .upsert(profileData, { 
          onConflict: 'user_id'
        })
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Successfully saved company profile:', data);

      toast({
        title: "Success",
        description: "Company profile saved successfully!",
      });

      return true;
    } catch (error) {
      console.error('Error saving company profile:', error);
      toast({
        title: "Error",
        description: `Failed to save company profile: ${error.message}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    getCompanyProfile,
    saveCompanyProfile,
    isLoading
  };
};

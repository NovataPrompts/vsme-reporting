
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useVSMEUserResponses = () => {
  const { toast } = useToast();

  const getUserResponse = useCallback(async (metricId: string) => {
    try {
      const { data, error } = await supabase
        .from('vsme_user_responses')
        .select('*')
        .eq('metric_id', metricId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error loading user response:', error);
      toast({
        title: "Error",
        description: "Failed to load response data.",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  const getUserResponseByNovataReference = useCallback(async (novataReference: string) => {
    try {
      // First, find the metric ID based on the Novata Reference
      const { data: metric, error: lookupError } = await supabase
        .from('consol')
        .select('id')
        .eq('novata_reference', novataReference)
        .maybeSingle();

      if (lookupError) throw lookupError;
      if (!metric) return null;

      // Then get the user response for that metric (organization-wide)
      const { data, error } = await supabase
        .from('vsme_user_responses')
        .select('*')
        .eq('metric_id', metric.id)
        .maybeSingle();

      if (error) throw error;

      // If we have response data, also try to get the tabular data with column order
      if (data && data.response_data && typeof data.response_data === 'object') {
        const { data: tabularData, error: tabularError } = await supabase
          .from('tabular_data')
          .select('*')
          .eq('novata_reference', novataReference)
          .maybeSingle();

        if (!tabularError && tabularData) {
          // Enhance the response with preserved column order
          return {
            ...data,
            response_data: {
              ...(data.response_data as object),
              tabularData: tabularData.data,
              originalColumnOrder: tabularData.column_order,
              sheetName: tabularData.sheet_name,
              originalFilename: tabularData.original_filename
            }
          };
        }
      }

      return data;
    } catch (error) {
      console.error('Error loading user response by Novata reference:', error);
      return null;
    }
  }, []);

  const saveUserResponse = useCallback(async (novataReference: string, responseValue: string, responseData?: any) => {
    try {
      // First, find the metric ID based on the Novata Reference
      console.log(`Looking up metric for Novata Reference: ${novataReference}`);
      
      const { data: metric, error: lookupError } = await supabase
        .from('consol')
        .select('id')
        .eq('novata_reference', novataReference)
        .maybeSingle();

      if (lookupError) {
        console.error('Error looking up metric:', lookupError);
        throw lookupError;
      }

      if (!metric) {
        console.warn(`No metric found for Novata Reference: ${novataReference}`);
        return false;
      }

      console.log(`Found metric ID ${metric.id} for reference ${novataReference}`);

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Get user's organization
      const { data: userOrg } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', user.user.id)
        .maybeSingle();

      // Now save the response using the correct metric ID
      const { error } = await supabase
        .from('vsme_user_responses')
        .upsert({
          metric_id: metric.id,
          user_id: user.user.id,
          organization_id: userOrg?.organization_id || null,
          response_value: responseValue,
          response_data: responseData
        });

      if (error) {
        console.error('Error saving user response:', error);
        throw error;
      }

      console.log(`Successfully saved response for ${novataReference}`);
      return true;
    } catch (error) {
      console.error('Error saving user response:', error);
      return false;
    }
  }, []);

  return {
    getUserResponse,
    getUserResponseByNovataReference,
    saveUserResponse
  };
};

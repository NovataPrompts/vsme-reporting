
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

      // Then get the user response for that metric
      const { data, error } = await supabase
        .from('vsme_user_responses')
        .select('*')
        .eq('metric_id', metric.id)
        .maybeSingle();

      if (error) throw error;
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

      // Now save the response using the correct metric ID
      const { error } = await supabase
        .from('vsme_user_responses')
        .upsert({
          metric_id: metric.id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
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

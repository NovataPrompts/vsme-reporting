
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { VSMEMetric } from '@/types/vsmeMetrics';

export const useVSMEDatabase = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const saveMetricResponse = async (metricReference: string, response: string, formattedResponse: string) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save metric responses.",
          variant: "destructive",
        });
        return false;
      }

      // Check if record exists
      const { data: existingData } = await supabase
        .from('vsme_report_content')
        .select('id')
        .eq('vsme_reference', metricReference)
        .eq('user_id', user.id)
        .single();

      if (existingData) {
        // Update existing record
        const { error } = await supabase
          .from('vsme_report_content')
          .update({
            user_response: response,
            formatted_response: formattedResponse,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('vsme_report_content')
          .insert({
            user_id: user.id,
            vsme_reference: metricReference,
            user_response: response,
            formatted_response: formattedResponse
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Metric response saved successfully!",
      });
      return true;
    } catch (error) {
      console.error('Error saving metric response:', error);
      toast({
        title: "Error",
        description: "Failed to save metric response. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loadSavedResponses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {};
      }

      const { data, error } = await supabase
        .from('vsme_report_content')
        .select('vsme_reference, user_response, formatted_response')
        .eq('user_id', user.id);

      if (error) throw error;

      const responses: Record<string, { response: string; formattedResponse: string }> = {};
      data?.forEach(item => {
        responses[item.vsme_reference] = {
          response: item.user_response || '',
          formattedResponse: item.formatted_response || ''
        };
      });

      return responses;
    } catch (error) {
      console.error('Error loading saved responses:', error);
      return {};
    }
  };

  return {
    saveMetricResponse,
    loadSavedResponses,
    isLoading
  };
};

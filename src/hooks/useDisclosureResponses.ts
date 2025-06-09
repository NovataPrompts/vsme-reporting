
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DisclosureResponse {
  id: string;
  user_id: string;
  disclosure_id: string;
  disclosure_title: string;
  response_content: string;
  graphics_recommendations?: any;
  created_at: string;
  updated_at: string;
}

export const useDisclosureResponses = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const saveDisclosureResponse = useCallback(async (
    disclosureId: string,
    disclosureTitle: string,
    responseContent: string,
    graphicsRecommendations?: any
  ) => {
    setIsLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('disclosure_responses')
        .upsert({
          user_id: user.user.id,
          disclosure_id: disclosureId,
          disclosure_title: disclosureTitle,
          response_content: responseContent,
          graphics_recommendations: graphicsRecommendations
        });

      if (error) throw error;

      toast({
        title: "Response Saved",
        description: `Disclosure response for ${disclosureTitle} has been saved successfully.`
      });

      return true;
    } catch (error) {
      console.error('Error saving disclosure response:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save disclosure response. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const loadDisclosureResponse = useCallback(async (disclosureId: string): Promise<DisclosureResponse | null> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return null;
      }

      const { data, error } = await supabase
        .from('disclosure_responses')
        .select('*')
        .eq('user_id', user.user.id)
        .eq('disclosure_id', disclosureId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error loading disclosure response:', error);
      return null;
    }
  }, []);

  const deleteDisclosureResponse = useCallback(async (disclosureId: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('disclosure_responses')
        .delete()
        .eq('user_id', user.user.id)
        .eq('disclosure_id', disclosureId);

      if (error) throw error;

      toast({
        title: "Response Deleted",
        description: "Disclosure response has been deleted successfully."
      });

      return true;
    } catch (error) {
      console.error('Error deleting disclosure response:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete disclosure response. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  return {
    saveDisclosureResponse,
    loadDisclosureResponse,
    deleteDisclosureResponse,
    isLoading
  };
};

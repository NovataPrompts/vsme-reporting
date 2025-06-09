
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
  organization_id?: string;
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
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Auth error:', userError);
        throw new Error('Authentication failed');
      }
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Saving disclosure response for user:', user.id);
      console.log('Disclosure data:', { disclosureId, disclosureTitle, responseContent: responseContent.substring(0, 100) + '...' });

      // Get user's organization
      const { data: userOrg } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', user.id)
        .maybeSingle();

      const { error } = await supabase
        .from('disclosure_responses')
        .upsert({
          user_id: user.id,
          organization_id: userOrg?.organization_id || null,
          disclosure_id: disclosureId,
          disclosure_title: disclosureTitle,
          response_content: responseContent,
          graphics_recommendations: graphicsRecommendations
        }, {
          onConflict: 'user_id,disclosure_id'
        });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Successfully saved disclosure response');

      toast({
        title: "Response Saved",
        description: `Disclosure response for ${disclosureTitle} has been saved successfully.`
      });

      return true;
    } catch (error) {
      console.error('Error saving disclosure response:', error);
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save disclosure response. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const loadDisclosureResponse = useCallback(async (disclosureId: string): Promise<DisclosureResponse | null> => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.log('User not authenticated, skipping load');
        return null;
      }

      const { data, error } = await supabase
        .from('disclosure_responses')
        .select('*')
        .eq('disclosure_id', disclosureId)
        .maybeSingle();

      if (error) {
        console.error('Error loading disclosure response:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error loading disclosure response:', error);
      return null;
    }
  }, []);

  const deleteDisclosureResponse = useCallback(async (disclosureId: string) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Auth error:', userError);
        throw new Error('Authentication failed');
      }
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('disclosure_responses')
        .delete()
        .eq('user_id', user.id)
        .eq('disclosure_id', disclosureId);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      toast({
        title: "Response Deleted",
        description: "Disclosure response has been deleted successfully."
      });

      return true;
    } catch (error) {
      console.error('Error deleting disclosure response:', error);
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete disclosure response. Please try again.",
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

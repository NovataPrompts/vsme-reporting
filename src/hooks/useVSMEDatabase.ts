
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { VSMEMetric } from '@/types/vsmeMetrics';
import { useVSMEDatabaseOperations } from './useVSMEDatabaseOperations';
import { useVSMEUserResponses } from './useVSMEUserResponses';

export const useVSMEDatabase = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const { upsertMetrics, insertProvidedMetrics, clearMetrics } = useVSMEDatabaseOperations();
  const { getUserResponse, saveUserResponse } = useVSMEUserResponses();

  const loadStaticMetrics = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Loading consolidated metrics from Supabase...');
      
      // Check if user is authenticated and has organization
      const { data: user } = await supabase.auth.getUser();
      console.log('Current user:', user.user?.email);
      
      if (user.user) {
        const { data: userOrg } = await supabase
          .from('user_organizations')
          .select('organization_id, organization:organizations(name)')
          .eq('user_id', user.user.id)
          .maybeSingle();
        
        console.log('User organization:', userOrg);
      }
      
      // Load data from the consol table, ordered by display_order
      const { data: consolMetrics, error } = await supabase
        .from('consol')
        .select('*')
        .order('display_order', { nullsFirst: false });

      console.log('Consol metrics loaded:', consolMetrics?.length || 0);
      console.log('Sample consol data:', consolMetrics?.slice(0, 2));

      if (error) {
        console.error('Error loading consol metrics:', error);
        throw error;
      }

      if (!consolMetrics || consolMetrics.length === 0) {
        console.log('No consol metrics found, inserting provided data...');
        await insertProvidedMetrics();
        
        // Try loading again after insertion
        const { data: retryData, error: retryError } = await supabase
          .from('consol')
          .select('*')
          .order('display_order', { nullsFirst: false });

        if (retryError) {
          console.error('Error on retry load:', retryError);
          throw retryError;
        }
        
        if (!retryData || retryData.length === 0) {
          console.log('Still no data after insertion');
          return [];
        }
        
        // Map the retry data
        const retryMetrics = retryData.map(metric => ({
          id: metric.id,
          module: 'Basic',
          disclosure: metric.disclosure || '',
          topic: metric.topic || '',
          section: metric.section || '',
          subSection: metric.sub_section || '',
          reference: metric.vsme_reference || '',
          novataReference: metric.novata_reference || '',
          metric: metric.metric || '',
          definition: metric.definition_summary || '',
          question: metric.question || '',
          inputType: metric.input_type || '',
          unit: metric.unit || '',
          response_options: metric.response_options || '',
          order: metric.display_order || 0
        }));

        console.log('Processed retry metrics:', retryMetrics.length);
        return retryMetrics;
      }

      // Map the consol data to our VSMEMetric interface
      const metrics = consolMetrics.map(metric => ({
        id: metric.id,
        module: 'Basic',
        disclosure: metric.disclosure || '',
        topic: metric.topic || '',
        section: metric.section || '',
        subSection: metric.sub_section || '',
        reference: metric.vsme_reference || '',
        novataReference: metric.novata_reference || '',
        metric: metric.metric || '',
        definition: metric.definition_summary || '',
        question: metric.question || '',
        inputType: metric.input_type || '',
        unit: metric.unit || '',
        response_options: metric.response_options || '',
        order: metric.display_order || 0
      }));

      console.log('Processed metrics:', metrics.length);
      console.log('Sample processed metrics:', metrics.slice(0, 3));
      console.log('Unique topics found:', [...new Set(metrics.map(m => m.topic))]);
      console.log('Unique sections found:', [...new Set(metrics.map(m => m.section))]);

      return metrics;
    } catch (error) {
      console.error('Error loading consol metrics:', error);
      toast({
        title: "Error",
        description: "Failed to load metrics data. Please try again.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast, insertProvidedMetrics]);

  return {
    loadStaticMetrics,
    upsertMetrics,
    insertProvidedMetrics,
    clearMetrics,
    getUserResponse,
    saveUserResponse,
    isLoading
  };
};

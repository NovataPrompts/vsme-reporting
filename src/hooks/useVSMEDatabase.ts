
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
      
      // Load data from the consolidated table only, ordered by order_index
      const { data: consolidatedMetrics, error } = await supabase
        .from('vsme_consolidated_metrics')
        .select('*')
        .order('order_index', { nullsFirst: false })
        .order('display_order', { nullsFirst: false });

      console.log('Consolidated metrics loaded:', consolidatedMetrics?.length || 0);

      if (error) throw error;

      if (!consolidatedMetrics || consolidatedMetrics.length === 0) {
        console.log('No consolidated metrics found, inserting provided data...');
        await insertProvidedMetrics();
        
        // Try loading again after insertion
        const { data: retryData, error: retryError } = await supabase
          .from('vsme_consolidated_metrics')
          .select('*')
          .order('order_index', { nullsFirst: false })
          .order('display_order', { nullsFirst: false });

        if (retryError) throw retryError;
        
        if (!retryData || retryData.length === 0) {
          console.log('Still no data after insertion');
          return [];
        }
        
        // Map the retry data
        const retryMetrics = retryData.map(metric => ({
          id: metric.metric_id,
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
          order: metric.order_index || metric.display_order || 0
        }));

        return retryMetrics;
      }

      // Map the consolidated data to our VSMEMetric interface
      const metrics = consolidatedMetrics.map(metric => ({
        id: metric.metric_id,
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
        order: metric.order_index || metric.display_order || 0
      }));

      console.log('Processed metrics:', metrics.length);
      console.log('Sample metrics:', metrics.slice(0, 3));
      console.log('Unique topics found:', [...new Set(metrics.map(m => m.topic))]);
      console.log('Unique sections found:', [...new Set(metrics.map(m => m.section))]);

      return metrics;
    } catch (error) {
      console.error('Error loading consolidated metrics:', error);
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


import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { VSMEMetric } from '@/types/vsmeMetrics';
import { providedVSMEMetrics } from '@/data/providedVSMEMetrics';

export const useVSMEDatabaseOperations = () => {
  const { toast } = useToast();

  const upsertMetrics = useCallback(async (metrics: VSMEMetric[]) => {
    try {
      console.log('Upserting metrics to consolidated table...', metrics.length);
      
      // Transform metrics to match the database schema
      const dbMetrics = metrics.map((metric, index) => ({
        metric_id: metric.id || crypto.randomUUID(),
        disclosure: metric.disclosure,
        topic: metric.topic,
        section: metric.section,
        sub_section: metric.subSection,
        vsme_reference: metric.reference,
        novata_reference: metric.novataReference,
        order_index: metric.order || index,
        metric: metric.metric,
        definition_summary: metric.definition,
        question: metric.question,
        input_type: metric.inputType,
        unit: metric.unit,
        response_options: metric.response_options,
        display_order: metric.order || index,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('vsme_consolidated_metrics')
        .upsert(dbMetrics, { 
          onConflict: 'metric_id',
          ignoreDuplicates: false 
        });

      if (error) throw error;

      console.log('Successfully upserted metrics:', dbMetrics.length);
      
      toast({
        title: "Success",
        description: `${dbMetrics.length} metrics have been successfully saved.`,
      });

      return true;
    } catch (error) {
      console.error('Error upserting metrics:', error);
      toast({
        title: "Error",
        description: "Failed to save metrics data. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  const insertProvidedMetrics = useCallback(async () => {
    try {
      console.log('Inserting all provided metrics data...');
      
      const { error } = await supabase
        .from('vsme_consolidated_metrics')
        .upsert(providedVSMEMetrics, { 
          onConflict: 'metric_id',
          ignoreDuplicates: false 
        });

      if (error) throw error;

      console.log('Successfully inserted all provided metrics:', providedVSMEMetrics.length);
      return true;
    } catch (error) {
      console.error('Error inserting provided metrics:', error);
      return false;
    }
  }, []);

  const clearMetrics = useCallback(async () => {
    try {
      console.log('Clearing all metrics from consolidated table...');
      
      const { error } = await supabase
        .from('vsme_consolidated_metrics')
        .delete()
        .neq('metric_id', ''); // Delete all rows

      if (error) throw error;

      console.log('Successfully cleared all metrics');
      
      toast({
        title: "Success",
        description: "All metrics have been cleared.",
      });

      return true;
    } catch (error) {
      console.error('Error clearing metrics:', error);
      toast({
        title: "Error",
        description: "Failed to clear metrics data.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  return {
    upsertMetrics,
    insertProvidedMetrics,
    clearMetrics
  };
};

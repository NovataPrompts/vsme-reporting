
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { VSMEMetric } from '@/types/vsmeMetrics';

export const useVSMEDatabase = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const loadStaticMetrics = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Loading consolidated metrics from Supabase...');
      
      // Load data from the consolidated table only
      const { data: consolidatedMetrics, error } = await supabase
        .from('vsme_consolidated_metrics')
        .select('*')
        .order('display_order', { nullsFirst: false });

      console.log('Consolidated metrics loaded:', consolidatedMetrics?.length || 0);

      if (error) throw error;

      if (!consolidatedMetrics || consolidatedMetrics.length === 0) {
        console.log('No consolidated metrics found');
        return [];
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
        order: metric.display_order || 0
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
  }, [toast]);

  const upsertMetrics = useCallback(async (metrics: VSMEMetric[]) => {
    setIsLoading(true);
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
        metric: metric.metric,
        definition_summary: metric.definition,
        question: metric.question,
        input_type: metric.inputType,
        unit: metric.unit,
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
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

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

  const saveUserResponse = useCallback(async (metricId: string, responseValue: string, responseData?: any) => {
    try {
      const { error } = await supabase
        .from('vsme_user_responses')
        .upsert({
          metric_id: metricId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          response_value: responseValue,
          response_data: responseData
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Response saved successfully.",
      });
      return true;
    } catch (error) {
      console.error('Error saving user response:', error);
      toast({
        title: "Error",
        description: "Failed to save response.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  return {
    loadStaticMetrics,
    upsertMetrics,
    clearMetrics,
    getUserResponse,
    saveUserResponse,
    isLoading
  };
};

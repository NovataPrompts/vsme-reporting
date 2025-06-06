
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
    getUserResponse,
    saveUserResponse,
    isLoading
  };
};

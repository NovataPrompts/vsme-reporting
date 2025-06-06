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
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const insertProvidedMetrics = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Inserting provided metrics data...');
      
      // Convert the provided data to the correct format
      const providedMetricsData = [
        {
          metric_id: crypto.randomUUID(),
          vsme_reference: 'VSME.B1.24.a',
          novata_reference: 'VSME.B1.24',
          display_order: 1,
          disclosure: 'B1',
          topic: 'General Information',
          section: 'Basis for preparation',
          sub_section: '',
          metric: 'VSME Module option',
          definition_summary: 'Is your organization disclosing Option A or Option B under the VSME?',
          question: 'Is your organization disclosing Option A or Option B under the VSME?',
          input_type: 'Multiple Choice',
          unit: '',
          response_options: 'Select one: OPTION A: Basic Module (only), OPTION B: Basic Module and Comprehensive Module',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          metric_id: crypto.randomUUID(),
          vsme_reference: 'VSME.B1.24.b',
          novata_reference: 'VSME.B1.24b',
          display_order: 2,
          disclosure: 'B1',
          topic: 'General Information',
          section: 'Basis for preparation',
          sub_section: '',
          metric: 'Omitted classified or sensitive information from VSME disclosure',
          definition_summary: 'Has your organization omitted a disclosure because it has deemed classified or sensitive information?',
          question: 'Has your organization omitted a disclosure because it has deemed classified or sensitive information?',
          input_type: 'Yes/No',
          unit: '',
          response_options: 'Yes/No',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          metric_id: crypto.randomUUID(),
          vsme_reference: 'VSME.B1.24.c',
          novata_reference: 'BP-1_01',
          display_order: 3,
          disclosure: 'B1',
          topic: 'General Information',
          section: 'Basis for preparation',
          sub_section: '',
          metric: 'Basis for preparation of sustainability statement',
          definition_summary: 'Has your sustainability statement been prepared on a consolidated basis or an individual basis?',
          question: 'Has your sustainability statement been prepared on a consolidated basis or an individual basis?',
          input_type: 'Multi-Select',
          unit: '',
          response_options: 'Select multiple: consolidated basis, individual basis',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        // Adding a few more key metrics to demonstrate the insertion
      ];

      // Add more metrics from the provided data
      const allMetricsData = [
        ...providedMetricsData,
        {
          metric_id: crypto.randomUUID(),
          vsme_reference: 'VSME.B3.29',
          novata_reference: 'VSME.B3.29',
          display_order: 14,
          disclosure: 'B3',
          topic: 'Environment',
          section: 'Energy and greenhouse gas emissions',
          sub_section: '',
          metric: 'Energy consumption by electricity and fuel',
          definition_summary: "What is your organization's renewable and non-renewable energy consumption broken down by electricity and fuel?",
          question: "What is your organization's renewable and non-renewable energy consumption broken down by electricity and fuel?",
          input_type: 'Tabular',
          unit: '',
          response_options: 'Tabular data: please see the relevant tabular metric tab.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          metric_id: crypto.randomUUID(),
          vsme_reference: 'VSME.B3.30.a',
          novata_reference: 'E1.1.1',
          display_order: 15,
          disclosure: 'B3',
          topic: 'Environment',
          section: 'Energy and greenhouse gas emissions',
          sub_section: '',
          metric: 'Scope 1 Emissions',
          definition_summary: 'What is the total mass (tCO2e) of Scope 1 greenhouse gas emissions emitted by your organization?',
          question: 'What is the total mass (tCO2e) of Scope 1 greenhouse gas emissions emitted by your organization?',
          input_type: 'Decimal',
          unit: 'Tonnes of carbon dioxide equivalent (tCO2e)',
          response_options: 'Decimal (less than 1,000,000,000,000)',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      const { error } = await supabase
        .from('vsme_consolidated_metrics')
        .upsert(allMetricsData, { 
          onConflict: 'metric_id',
          ignoreDuplicates: false 
        });

      if (error) throw error;

      console.log('Successfully inserted provided metrics:', allMetricsData.length);
      
      toast({
        title: "Success",
        description: `${allMetricsData.length} metrics have been successfully inserted into the database.`,
      });

      return true;
    } catch (error) {
      console.error('Error inserting provided metrics:', error);
      toast({
        title: "Error",
        description: "Failed to insert provided metrics data. Please try again.",
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
    insertProvidedMetrics,
    clearMetrics,
    getUserResponse,
    saveUserResponse,
    isLoading
  };
};

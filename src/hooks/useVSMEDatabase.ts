import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useVSMEDatabase = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const loadStaticMetrics = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Loading static metrics from Supabase...');
      
      // Load data from all relevant tables
      const [
        { data: reportContent, error: reportError },
        { data: sectionInfo, error: sectionError },
        { data: disclosureDetail, error: disclosureError },
        { data: refConverter, error: refError }
      ] = await Promise.all([
        supabase.from('vsme_report_content').select('*').order('novata_reference'),
        supabase.from('section_info').select('*'),
        supabase.from('disclosure_detail').select('*'),
        supabase.from('vsme_novata_ref_converter').select('*').order('order')
      ]);

      console.log('Raw data loaded:', {
        reportContent: reportContent?.length || 0,
        sectionInfo: sectionInfo?.length || 0,
        disclosureDetail: disclosureDetail?.length || 0,
        refConverter: refConverter?.length || 0
      });

      // Log sample data to understand structure
      console.log('Sample reportContent:', reportContent?.slice(0, 2));
      console.log('Sample sectionInfo:', sectionInfo?.slice(0, 2));
      console.log('Sample refConverter:', refConverter?.slice(0, 2));

      if (reportError) throw reportError;
      if (sectionError) throw sectionError;
      if (disclosureError) throw disclosureError;
      if (refError) throw refError;

      // Build the metrics by combining all data sources
      const combinedMetrics = reportContent?.map(content => {
        // Find section information using novata_reference
        // Try exact match first, then partial match if needed
        let sectionData = sectionInfo?.find(s => s.disclosure === content.novata_reference);
        
        // If no exact match, try to find by checking if the novata_reference starts with the disclosure
        if (!sectionData) {
          sectionData = sectionInfo?.find(s => 
            s.disclosure && content.novata_reference && 
            content.novata_reference.startsWith(s.disclosure)
          );
        }
        
        // Get the VSME reference from the converter table
        const vsmeRef = refConverter?.find(r => r.novata_reference === content.novata_reference);
        
        // Get additional disclosure details if available
        const disclosureData = disclosureDetail?.find(d => d.novata_reference === content.novata_reference);

        // Log mapping results for debugging
        if (!sectionData) {
          console.log(`No section data found for: ${content.novata_reference}`);
        }

        return {
          id: content.id,
          module: 'Basic',
          disclosure: content.novata_reference || '',
          topic: sectionData?.topic || 'No Topic Found',
          section: sectionData?.section || 'No Section Found',
          subSection: sectionData?.sub_section || '',
          reference: vsmeRef?.vsme_reference || '',
          novataReference: content.novata_reference || '',
          metric: content.metric || '',
          definition: content.definition_summary || '',
          question: content.question || '',
          inputType: content.input_type || '',
          unit: content.unit || '',
          order: vsmeRef?.order || 0
        };
      }) || [];

      console.log('Combined metrics:', combinedMetrics.length);
      console.log('Sample combined metrics:', combinedMetrics.slice(0, 3));
      console.log('Unique topics found:', [...new Set(combinedMetrics.map(m => m.topic))]);
      console.log('Unique sections found:', [...new Set(combinedMetrics.map(m => m.section))]);

      // Sort by order
      const sortedMetrics = combinedMetrics.sort((a, b) => (a.order || 0) - (b.order || 0));

      return sortedMetrics;
    } catch (error) {
      console.error('Error loading static metrics:', error);
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

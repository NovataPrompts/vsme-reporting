
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

      if (reportError) {
        console.error('Report content error:', reportError);
        throw reportError;
      }
      if (sectionError) {
        console.error('Section info error:', sectionError);
        throw sectionError;
      }
      if (disclosureError) {
        console.error('Disclosure detail error:', disclosureError);
        throw disclosureError;
      }
      if (refError) {
        console.error('Ref converter error:', refError);
        throw refError;
      }

      // Combine the data to create complete metric objects
      const combinedMetrics = reportContent?.map(content => {
        // Find matching section info - match by the first part of novata_reference (before the dot)
        const disclosureCode = content.novata_reference?.split('.')[0];
        const section = sectionInfo?.find(s => s.disclosure === disclosureCode);
        
        // Find matching disclosure detail
        const disclosure = disclosureDetail?.find(d => d.novata_reference === content.novata_reference);
        
        // Find matching VSME reference
        const vsmeRef = refConverter?.find(r => r.novata_reference === content.novata_reference);

        const combinedMetric = {
          id: content.id,
          module: 'Basic', // Default module
          disclosure: section?.disclosure || disclosureCode || '',
          topic: section?.topic || 'Uncategorized',
          section: section?.section || '',
          subSection: section?.sub_section || '',
          reference: vsmeRef?.vsme_reference || '',
          novataReference: content.novata_reference || '',
          metric: content.metric || '',
          definition: content.definition_summary || '',
          question: content.question || '',
          inputType: content.input_type || '',
          unit: content.unit || '',
          order: vsmeRef?.order || 0
        };

        return combinedMetric;
      }) || [];

      console.log('Final combined metrics:', combinedMetrics.length);

      return combinedMetrics;
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

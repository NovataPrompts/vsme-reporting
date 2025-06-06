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

      // Log the section_info data to verify structure
      console.log('Section info data:', sectionInfo);
      console.log('Sample report content:', reportContent?.slice(0, 3));

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
        // Find matching VSME reference first
        const vsmeRef = refConverter?.find(r => r.novata_reference === content.novata_reference);
        
        // Extract disclosure code from novata_reference (e.g., "B1.1" -> "B1")
        const disclosureCode = content.novata_reference?.split('.')[0];
        
        // Find matching section info using the disclosure code from section_info table
        const sectionData = sectionInfo?.find(s => s.disclosure === disclosureCode);
        
        // Find matching disclosure detail
        const disclosure = disclosureDetail?.find(d => d.novata_reference === content.novata_reference);

        // Log detailed mapping for debugging
        console.log('Mapping for:', content.novata_reference, {
          disclosureCode,
          sectionData,
          foundInSectionInfo: !!sectionData
        });

        return {
          id: content.id,
          module: 'Basic', // All entries are Basic module
          disclosure: sectionData?.disclosure || disclosureCode || '', // Use section_info.disclosure or fallback
          topic: sectionData?.topic || 'Unknown Topic', // Use section_info.topic
          section: sectionData?.section || 'Unknown Section', // Use section_info.section  
          subSection: sectionData?.sub_section || '', // Use section_info.sub_section (can be empty)
          reference: vsmeRef?.vsme_reference || '', // VSME reference
          novataReference: content.novata_reference || '', // Keep for internal use but not display in top row
          metric: content.metric || '',
          definition: content.definition_summary || '',
          question: content.question || '',
          inputType: content.input_type || '',
          unit: content.unit || '',
          order: vsmeRef?.order || 0
        };
      }) || [];

      console.log('Final combined metrics sample:', combinedMetrics.slice(0, 5));
      console.log('Total metrics combined:', combinedMetrics.length);
      console.log('Topics found:', [...new Set(combinedMetrics.map(m => m.topic))]);
      console.log('Disclosures found:', [...new Set(combinedMetrics.map(m => m.disclosure))]);

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


import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useVSMEDatabase = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const loadStaticMetrics = async () => {
    setIsLoading(true);
    try {
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

      if (reportError) throw reportError;
      if (sectionError) throw sectionError;
      if (disclosureError) throw disclosureError;
      if (refError) throw refError;

      // Combine the data to create complete metric objects
      const combinedMetrics = reportContent?.map(content => {
        // Find matching section info
        const section = sectionInfo?.find(s => s.disclosure === content.novata_reference?.split('.')[0]);
        
        // Find matching disclosure detail
        const disclosure = disclosureDetail?.find(d => d.novata_reference === content.novata_reference);
        
        // Find matching VSME reference
        const vsmeRef = refConverter?.find(r => r.novata_reference === content.novata_reference);

        return {
          id: content.id,
          module: 'Basic', // Default module
          disclosure: section?.disclosure || '',
          topic: section?.topic || '',
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
      }) || [];

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
  };

  const getUserResponse = async (metricId: string) => {
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
  };

  const saveUserResponse = async (metricId: string, responseValue: string, responseData?: any) => {
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
  };

  return {
    loadStaticMetrics,
    getUserResponse,
    saveUserResponse,
    isLoading
  };
};

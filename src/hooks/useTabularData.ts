
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useTabularData = () => {
  const { toast } = useToast();

  const saveTabularData = useCallback(async (
    novataReference: string,
    data: any[],
    columnOrder: string[],
    originalFilename?: string,
    sheetName?: string
  ) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Get user's organization
      const { data: userOrg } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', user.user.id)
        .maybeSingle();

      const { error } = await supabase
        .from('tabular_data')
        .upsert({
          novata_reference: novataReference,
          user_id: user.user.id,
          organization_id: userOrg?.organization_id || null,
          data: data,
          column_order: columnOrder,
          original_filename: originalFilename,
          sheet_name: sheetName
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving tabular data:', error);
      return false;
    }
  }, []);

  const getTabularData = useCallback(async (novataReference: string) => {
    try {
      const { data, error } = await supabase
        .from('tabular_data')
        .select('*')
        .eq('novata_reference', novataReference)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error loading tabular data:', error);
      return null;
    }
  }, []);

  return {
    saveTabularData,
    getTabularData
  };
};

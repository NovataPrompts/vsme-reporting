
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useVSMEDatabase = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const loadStaticMetrics = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('vsme_report_content')
        .select('*')
        .order('vsme_reference');

      if (error) throw error;

      return data || [];
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

  return {
    loadStaticMetrics,
    isLoading
  };
};

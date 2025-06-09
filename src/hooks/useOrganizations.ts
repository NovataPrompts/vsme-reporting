
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Organization {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface UserOrganization {
  id: string;
  user_id: string;
  organization_id: string;
  role: string;
  created_at: string;
  organization: Organization;
}

export const useOrganizations = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const getUserOrganizations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('user_organizations')
        .select(`
          *,
          organization:organizations(*)
        `)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      return data as UserOrganization[];
    } catch (error) {
      console.error('Error fetching user organizations:', error);
      return [];
    }
  }, []);

  const createOrganization = useCallback(async (name: string) => {
    setIsLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Create organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({ name })
        .select()
        .single();

      if (orgError) throw orgError;

      // Add current user as admin
      const { error: memberError } = await supabase
        .from('user_organizations')
        .insert({
          user_id: user.user.id,
          organization_id: org.id,
          role: 'admin'
        });

      if (memberError) throw memberError;

      toast({
        title: "Organization Created",
        description: `${name} has been created successfully.`
      });

      return org;
    } catch (error) {
      console.error('Error creating organization:', error);
      toast({
        title: "Error",
        description: "Failed to create organization. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const addUserToOrganization = useCallback(async (email: string, organizationId: string, role: string = 'member') => {
    setIsLoading(true);
    try {
      // First, we need to find the user by email
      // Note: In a real app, you'd want to have a proper user invitation system
      // For now, we'll assume the user exists and we have their ID
      
      toast({
        title: "User Invitation",
        description: "User invitation system would be implemented here. For demo purposes, both demo users should be manually added to the same organization.",
      });

      return false;
    } catch (error) {
      console.error('Error adding user to organization:', error);
      toast({
        title: "Error",
        description: "Failed to add user to organization.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getCurrentUserOrganization = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('user_organizations')
        .select(`
          organization:organizations(*)
        `)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .limit(1)
        .maybeSingle();

      return data?.organization as Organization | null;
    } catch (error) {
      console.error('Error fetching current user organization:', error);
      return null;
    }
  }, []);

  return {
    getUserOrganizations,
    createOrganization,
    addUserToOrganization,
    getCurrentUserOrganization,
    isLoading
  };
};

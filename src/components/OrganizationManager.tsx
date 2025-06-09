
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrganizations, Organization } from '@/hooks/useOrganizations';
import { useToast } from '@/hooks/use-toast';

export const OrganizationManager = () => {
  const { getUserOrganizations, createOrganization, getCurrentUserOrganization, isLoading } = useOrganizations();
  const { toast } = useToast();
  const [organizationName, setOrganizationName] = useState('');
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);

  useEffect(() => {
    const loadCurrentOrganization = async () => {
      const org = await getCurrentUserOrganization();
      setCurrentOrg(org);
    };
    loadCurrentOrganization();
  }, [getCurrentUserOrganization]);

  const handleCreateOrganization = async () => {
    if (!organizationName.trim()) {
      toast({
        title: "Error",
        description: "Please enter an organization name.",
        variant: "destructive"
      });
      return;
    }

    const org = await createOrganization(organizationName.trim());
    if (org) {
      setCurrentOrg(org);
      setOrganizationName('');
    }
  };

  if (currentOrg) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Organization</CardTitle>
          <CardDescription>You are a member of this organization</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium">{currentOrg.name}</p>
          <p className="text-sm text-muted-foreground mt-2">
            All data is shared within this organization. Users demo@novata.com and novata+demo@novata.com 
            should be members of the same organization to share data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Organization</CardTitle>
        <CardDescription>Create an organization to share data with other users</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Organization name (e.g., Novata Demo)"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateOrganization()}
          />
          <Button 
            onClick={handleCreateOrganization}
            disabled={isLoading || !organizationName.trim()}
          >
            Create
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          After creating an organization, both demo@novata.com and novata+demo@novata.com 
          should be added to the same organization to share data.
        </p>
      </CardContent>
    </Card>
  );
};

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Info } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useCompanyProfile } from '@/hooks/useCompanyProfile';
import { useToast } from '@/hooks/use-toast';

interface CompanyProfileModalProps {
  isOpen: boolean;
  onComplete: () => void;
  onClose: () => void;
}

export const CompanyProfileModal = ({ isOpen, onComplete, onClose }: CompanyProfileModalProps) => {
  const { saveCompanyProfile, getCompanyProfile, isLoading } = useCompanyProfile();
  const { toast } = useToast();
  const [fiscalYearEnd, setFiscalYearEnd] = useState<Date>();
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isPrefilledFromOrg, setIsPrefilledFromOrg] = useState(false);
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<{
    name: string;
    company_structure: string;
    dba_name: string;
    year_of_incorporation: number;
    company_description: string;
    website: string;
    country_of_domicile: string;
    primary_currency: string;
  }>();

  const watchedName = watch('name');
  const watchedCountry = watch('country_of_domicile');

  // Load existing profile data when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadProfile = async () => {
        setIsLoadingProfile(true);
        setIsPrefilledFromOrg(false);
        try {
          const profile = await getCompanyProfile();
          if (profile) {
            console.log('Loaded profile data:', profile);
            
            // Check if this is from organization (no user_id or different user_id)
            const { data: currentUser } = await supabase.auth.getUser();
            if (profile.user_id !== currentUser.user?.id) {
              setIsPrefilledFromOrg(true);
              toast({
                title: "Profile Pre-filled",
                description: "Company information has been pre-filled from your organization. You can modify it as needed.",
              });
            }
            
            // Set form values
            setValue('name', profile.name || '');
            setValue('company_structure', profile.company_structure || '');
            setValue('dba_name', profile.dba_name || '');
            setValue('year_of_incorporation', profile.year_of_incorporation || undefined);
            setValue('company_description', profile.company_description || '');
            setValue('website', profile.website || '');
            setValue('country_of_domicile', profile.country_of_domicile || '');
            setValue('primary_currency', profile.primary_currency || 'USD');
            
            // Set fiscal year end date
            if (profile.fiscal_year_end) {
              setFiscalYearEnd(parseISO(profile.fiscal_year_end));
            }
          }
        } catch (error) {
          console.error('Error loading profile:', error);
        } finally {
          setIsLoadingProfile(false);
        }
      };
      
      loadProfile();
    } else {
      // Reset form when modal closes
      reset();
      setFiscalYearEnd(undefined);
      setIsPrefilledFromOrg(false);
    }
  }, [isOpen, getCompanyProfile, setValue, reset, toast]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const countries = [
    "United States", "Canada", "United Kingdom", "Australia", "Germany", 
    "France", "Japan", "South Korea", "Singapore", "Hong Kong", "Netherlands",
    "Switzerland", "Sweden", "Norway", "Denmark", "Finland", "Ireland", "Belgium",
    "Austria", "Luxembourg", "Spain", "Italy", "Portugal", "Brazil", "Mexico",
    "Argentina", "Chile", "Colombia", "Peru", "South Africa", "India", "China"
  ].sort();

  const currencies = [
    "USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "SEK", "NOK", "DKK",
    "SGD", "HKD", "CNY", "INR", "BRL", "MXN", "ZAR", "KRW"
  ];

  const handleClose = () => {
    // Check if required fields are filled
    if (!watchedName || !watchedCountry) {
      toast({
        title: "Required Information Missing",
        description: "Please fill out Company Name and Country of Domicile before closing.",
        variant: "destructive",
      });
      return;
    }
    onClose();
  };

  const onSubmit = async (data: any) => {
    console.log('Form data before saving:', data);
    console.log('Fiscal year end:', fiscalYearEnd);
    
    const profileData = {
      name: data.name,
      company_structure: data.company_structure || '',
      dba_name: data.dba_name || '',
      year_of_incorporation: data.year_of_incorporation || null,
      company_description: data.company_description || '',
      website: data.website || '',
      country_of_domicile: data.country_of_domicile,
      primary_currency: data.primary_currency || 'USD',
      fiscal_year_end: fiscalYearEnd ? format(fiscalYearEnd, 'yyyy-MM-dd') : null
    };

    console.log('Profile data to save:', profileData);
    
    const success = await saveCompanyProfile(profileData);
    if (success) {
      onComplete();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Company Profile Setup</DialogTitle>
          <p className="text-center text-gray-600">Please provide your company information to get started</p>
          {isPrefilledFromOrg && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200 mt-2">
              <Info className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                This form has been pre-filled with your organization's company information. You can modify any fields as needed.
              </p>
            </div>
          )}
        </DialogHeader>
        
        {isLoadingProfile ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-lg">Loading profile...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Company name is required' })}
                  placeholder="Enter company name"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_structure">Company Structure</Label>
                <Select 
                  onValueChange={(value) => setValue('company_structure', value)}
                  value={watch('company_structure') || ''}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="e.g., Public, Private" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Public">Public</SelectItem>
                    <SelectItem value="Private">Private</SelectItem>
                    <SelectItem value="Partnership">Partnership</SelectItem>
                    <SelectItem value="LLC">LLC</SelectItem>
                    <SelectItem value="Corporation">Corporation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dba_name">DBA Name (if applicable)</Label>
                <Input
                  id="dba_name"
                  {...register('dba_name')}
                  placeholder="Doing Business As name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year_of_incorporation">Year of Incorporation</Label>
                <Select 
                  onValueChange={(value) => setValue('year_of_incorporation', value ? parseInt(value) : undefined)}
                  value={watch('year_of_incorporation')?.toString() || ''}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_description">Company Description</Label>
              <Textarea
                id="company_description"
                {...register('company_description')}
                placeholder="Describe your company's business and activities"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                {...register('website')}
                placeholder="https://www.example.com"
                type="url"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country_of_domicile">Country of Domicile *</Label>
                <Select 
                  onValueChange={(value) => setValue('country_of_domicile', value)}
                  value={watch('country_of_domicile') || ''}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country_of_domicile && (
                  <p className="text-sm text-red-600">{errors.country_of_domicile.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="primary_currency">Primary Currency</Label>
                <Select 
                  onValueChange={(value) => setValue('primary_currency', value)} 
                  value={watch('primary_currency') || 'USD'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Fiscal Year End</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !fiscalYearEnd && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fiscalYearEnd ? format(fiscalYearEnd, "MMM dd") : "Select fiscal year end"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fiscalYearEnd}
                    onSelect={setFiscalYearEnd}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Close
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#077bc0] hover:bg-[#077bc0]/90"
              >
                {isLoading ? "Saving..." : "Complete Setup"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

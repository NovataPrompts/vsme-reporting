
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "./AuthForm";
import { CompanyProfileForm } from "./CompanyProfileForm";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasCompanyProfile, setHasCompanyProfile] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const { getCompanyProfile } = useCompanyProfile();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const checkCompanyProfile = async () => {
      if (user) {
        setCheckingProfile(true);
        const profile = await getCompanyProfile();
        setHasCompanyProfile(!!profile);
        setCheckingProfile(false);
      } else {
        setCheckingProfile(false);
      }
    };

    if (!loading) {
      checkCompanyProfile();
    }
  }, [user, loading, getCompanyProfile]);

  const handleProfileComplete = () => {
    setHasCompanyProfile(true);
  };

  if (loading || checkingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <AuthForm />
      </div>
    );
  }

  if (!hasCompanyProfile) {
    return <CompanyProfileForm onComplete={handleProfileComplete} />;
  }

  return <>{children}</>;
};

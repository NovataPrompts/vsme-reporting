
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { QuickNav } from "../navigation/QuickNav";

const PASSWORD = "novataVSME2025$";

export const PasswordPage = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === PASSWORD) {
      // Set authentication in localStorage
      localStorage.setItem("vsme-auth", "true");
      toast({
        title: "Access granted",
        description: "Welcome to the VSME Reporting platform",
      });
      // Add a console log to confirm this code is reached
      console.log("Password correct, redirecting to index page");
      navigate("/");
    } else {
      setError(true);
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "The password you entered is incorrect",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background Image with Overlay - same as Index */}
      <div className="absolute inset-0 -z-10">
        <img 
          src="/lovable-uploads/43c7e6d0-8a2f-432f-9320-55b38b1bb6b8.png" 
          alt="Northern Lights" 
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-primary/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
      </div>
      
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="glass-card max-w-md w-full p-8 rounded-xl shadow-xl animate-fadeIn">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <LockKeyhole className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">VSME Reporting</h1>
            <p className="text-white/80">Enter password to access the platform</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Enter password"
                className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 ${
                  error ? "border-red-500" : ""
                }`}
              />
              {error && (
                <p className="text-red-400 text-sm">Incorrect password. Please try again.</p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-[#d8f225] hover:bg-[#d8f225]/90 text-[#00344d] rounded-md py-6"
            >
              Access Platform
            </Button>
          </form>
        </div>
      </main>
      
      {/* Add QuickNav here */}
      <QuickNav />
    </div>
  );
};

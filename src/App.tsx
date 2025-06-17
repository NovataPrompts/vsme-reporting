
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Metrics from "./pages/Metrics";
import CalculatedMetrics from "./pages/CalculatedMetrics";
import MetricDetail from "./pages/MetricDetail";
import Standards from "./pages/Standards";
import Import from "./pages/Import";
import Welcome from "./pages/Welcome";
import Disclosure from "./pages/Disclosure";
import Draft from "./pages/Draft";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

const LocationLogger = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log('App - Current location:', {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      state: location.state,
      key: location.key
    });
  }, [location]);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <LocationLogger />
        <Routes>
          <Route 
            path="/" 
            element={<Navigate to="/welcome" replace />} 
          />
          <Route 
            path="/welcome" 
            element={<Welcome />} 
          />
          <Route 
            path="/dashboard" 
            element={<Dashboard />} 
          />
          <Route 
            path="/reports" 
            element={<Reports />} 
          />
          <Route 
            path="/metrics" 
            element={<Metrics />} 
          />
          <Route 
            path="/metrics/calculated" 
            element={<CalculatedMetrics />} 
          />
          <Route 
            path="/metric/:id" 
            element={<MetricDetail />} 
          />
          <Route 
            path="/standards" 
            element={<Standards />} 
          />
          <Route 
            path="/disclosure" 
            element={<Disclosure />} 
          />
          <Route 
            path="/draft" 
            element={<Draft />} 
          />
          <Route 
            path="/import" 
            element={<Import />} 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route 
            path="*" 
            element={<NotFound />} 
          />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

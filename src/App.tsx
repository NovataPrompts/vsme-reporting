import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Metrics from "./pages/Metrics";
import CalculatedMetrics from "./pages/CalculatedMetrics";
import MetricDetail from "./pages/MetricDetail";
import Standards from "./pages/Standards";
import Import from "./pages/Import";
import Welcome from "./pages/Welcome";
import NotFound from "./pages/NotFound";
import PasswordProtected from "./pages/PasswordProtected";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/welcome" 
            element={
              <ProtectedRoute>
                <Welcome />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/metrics" 
            element={
              <ProtectedRoute>
                <Metrics />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/metrics/calculated" 
            element={
              <ProtectedRoute>
                <CalculatedMetrics />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/metric/:id" 
            element={
              <ProtectedRoute>
                <MetricDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/standards" 
            element={
              <ProtectedRoute>
                <Standards />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/import" 
            element={
              <ProtectedRoute>
                <Import />
              </ProtectedRoute>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/password" element={<PasswordProtected />} />
          <Route 
            path="*" 
            element={
              <ProtectedRoute>
                <NotFound />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

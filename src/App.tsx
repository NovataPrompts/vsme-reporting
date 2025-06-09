
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
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
            element={<Navigate to="/welcome" replace />} 
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
            path="/disclosure" 
            element={
              <ProtectedRoute>
                <Disclosure />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/draft" 
            element={
              <ProtectedRoute>
                <Draft />
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

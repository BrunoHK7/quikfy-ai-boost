
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmailVerification from "./pages/EmailVerification";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import Settings from "./pages/Settings";
import Pricing from "./pages/Pricing";
import CarouselGenerator from "./pages/CarouselGenerator";
import CarouselCreator from "./pages/CarouselCreator";
import Podcasts from "./pages/Podcasts";
import ContentFeed from "./pages/ContentFeed";
import FinancialManagement from "./pages/FinancialManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/email-verification" element={<EmailVerification />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/public-profile/:userId" element={<PublicProfile />} />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/carousel-generator" element={
              <ProtectedRoute requiresPremium={true}>
                <CarouselGenerator />
              </ProtectedRoute>
            } />
            <Route path="/carousel-creator" element={
              <ProtectedRoute>
                <CarouselCreator />
              </ProtectedRoute>
            } />
            <Route path="/financial-management" element={
              <ProtectedRoute>
                <FinancialManagement />
              </ProtectedRoute>
            } />
            <Route path="/podcasts" element={
              <ProtectedRoute requiresPremium={true}>
                <Podcasts />
              </ProtectedRoute>
            } />
            <Route path="/content-feed" element={
              <ProtectedRoute requiresPremium={true}>
                <ContentFeed />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

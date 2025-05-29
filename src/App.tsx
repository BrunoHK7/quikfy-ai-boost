
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmailVerification from "./pages/EmailVerification";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import Settings from "./pages/Settings";
import Pricing from "./pages/Pricing";
import CarouselCreator from "./pages/CarouselCreator";
import CarouselBriefing from "./pages/CarouselBriefing";
import CarouselResult from "./pages/CarouselResult";
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

const AppContent: React.FC = () => {
  const { preferences } = useUserPreferences();
  const currentLanguage = (preferences?.language || 'pt') as 'pt' | 'en' | 'es';

  return (
    <TranslationProvider language={currentLanguage}>
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
          {/* Ferramentas - acessíveis a todos os usuários autenticados (consomem créditos) */}
          <Route path="/carousel-generator" element={
            <ProtectedRoute>
              <CarouselBriefing />
            </ProtectedRoute>
          } />
          <Route path="/carousel-creator" element={
            <ProtectedRoute>
              <CarouselCreator />
            </ProtectedRoute>
          } />
          <Route path="/carousel-briefing" element={
            <ProtectedRoute>
              <CarouselBriefing />
            </ProtectedRoute>
          } />
          <Route path="/carousel-result" element={
            <ProtectedRoute>
              <CarouselResult />
            </ProtectedRoute>
          } />
          <Route path="/financial-management" element={
            <ProtectedRoute>
              <FinancialManagement />
            </ProtectedRoute>
          } />
          {/* Conteúdo premium - apenas para usuários pagos e admins */}
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
    </TranslationProvider>
  );
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

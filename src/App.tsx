
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
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
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
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/AdminDashboard";
import CreateCourse from "./pages/CreateCourse";
import CourseView from "./pages/CourseView";
import LessonView from "./pages/LessonView";
import NotFound from "./pages/NotFound";
import Tools from "./pages/Tools";

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
          <Route path="/tools" element={<Tools />} />
          <Route path="/terms" element={
            <React.Suspense fallback={<div>Carregando...</div>}>
              {React.createElement(React.lazy(() => import('./pages/Terms')))}
            </React.Suspense>
          } />
          <Route path="/privacy" element={
            <React.Suspense fallback={<div>Carregando...</div>}>
              {React.createElement(React.lazy(() => import('./pages/Privacy')))}
            </React.Suspense>
          } />
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
          
          {/* Ferramentas - acessíveis a todos os usuários autenticados */}
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

          {/* Cursos - acessíveis a todos os usuários autenticados */}
          <Route path="/courses/:courseId" element={
            <ProtectedRoute>
              <CourseView />
            </ProtectedRoute>
          } />
          <Route path="/courses/:courseId/lessons/:lessonId" element={
            <ProtectedRoute>
              <LessonView />
            </ProtectedRoute>
          } />

          {/* Autenticação admin */}
          <Route path="/admin-auth" element={<AdminAuth />} />

          {/* Rotas de administração - protegidas por senha */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            </ProtectedRoute>
          } />
          <Route path="/admin/create-course" element={
            <ProtectedRoute>
              <AdminProtectedRoute>
                <CreateCourse />
              </AdminProtectedRoute>
            </ProtectedRoute>
          } />

          {/* Catch-all route */}
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

import React from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TranslationProvider } from '@/contexts/TranslationContext';
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import Settings from "./pages/Settings";
import Tools from "./pages/Tools";
import CarouselBriefing from "./pages/CarouselBriefing";
import CarouselCreator from "./pages/CarouselCreator";
import CarouselGenerator from "./pages/CarouselGenerator";
import CarouselResult from "./pages/CarouselResult";
import Pricing from "./pages/Pricing";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import ContentFeed from "./pages/ContentFeed";
import Courses from "./pages/Courses";
import CourseView from "./pages/CourseView";
import LessonView from "./pages/LessonView";
import Podcasts from "./pages/Podcasts";
import FinancialManagement from "./pages/FinancialManagement";
import EmailVerification from "./pages/EmailVerification";
import NotFound from "./pages/NotFound";
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/AdminDashboard";
import CreateCourse from "./pages/CreateCourse";
import EditCourse from "./pages/EditCourse";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TranslationProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/email-verification" element={<EmailVerification />} />
              <Route path="/admin-auth" element={<AdminAuth />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/profile/:userId" element={<PublicProfile />} />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              
              <Route path="/tools" element={
                <ProtectedRoute>
                  <Tools />
                </ProtectedRoute>
              } />
              
              <Route path="/carousel-briefing" element={
                <ProtectedRoute>
                  <CarouselBriefing />
                </ProtectedRoute>
              } />
              
              <Route path="/carousel-creator" element={
                <ProtectedRoute>
                  <CarouselCreator />
                </ProtectedRoute>
              } />
              
              <Route path="/carousel-generator" element={
                <ProtectedRoute>
                  <CarouselGenerator />
                </ProtectedRoute>
              } />
              
              <Route path="/carousel-result" element={
                <ProtectedRoute>
                  <CarouselResult />
                </ProtectedRoute>
              } />
              
              <Route path="/content" element={
                <ProtectedRoute>
                  <ContentFeed />
                </ProtectedRoute>
              } />
              
              <Route path="/courses" element={
                <ProtectedRoute>
                  <Courses />
                </ProtectedRoute>
              } />
              
              <Route path="/course/:courseId" element={
                <ProtectedRoute>
                  <CourseView />
                </ProtectedRoute>
              } />
              
              <Route path="/lesson/:lessonId" element={
                <ProtectedRoute>
                  <LessonView />
                </ProtectedRoute>
              } />
              
              <Route path="/podcasts" element={
                <ProtectedRoute>
                  <Podcasts />
                </ProtectedRoute>
              } />
              
              <Route path="/financial" element={
                <ProtectedRoute>
                  <FinancialManagement />
                </ProtectedRoute>
              } />
              
              <Route path="/admin" element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              } />
              
              <Route path="/admin/create-course" element={
                <AdminProtectedRoute>
                  <CreateCourse />
                </AdminProtectedRoute>
              } />
              
              <Route path="/admin/edit-course/:courseId" element={
                <AdminProtectedRoute>
                  <EditCourse />
                </AdminProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TranslationProvider>
    </QueryClientProvider>
  );
}

export default App;

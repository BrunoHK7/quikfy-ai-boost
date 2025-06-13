
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

import { AuthProvider } from '@/hooks/useAuth';

import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';
import PublicProfile from '@/pages/PublicProfile';
import CarouselBriefing from '@/pages/CarouselBriefing';
import CarouselGenerator from '@/pages/CarouselGenerator';
import CarouselResult from '@/pages/CarouselResult';
import CarouselCreator from '@/pages/CarouselCreator';
import Settings from '@/pages/Settings';
import Pricing from '@/pages/Pricing';
import ContentFeed from '@/pages/ContentFeed';
import Courses from '@/pages/Courses';
import CourseOverview from '@/pages/CourseOverview';
import CourseView from '@/pages/CourseView';
import LessonView from '@/pages/LessonView';
import CreateCourse from '@/pages/CreateCourse';
import EditCourse from '@/pages/EditCourse';
import Podcasts from '@/pages/Podcasts';
import AdminAuth from '@/pages/AdminAuth';
import AdminDashboard from '@/pages/AdminDashboard';
import EmailVerification from '@/pages/EmailVerification';
import FinancialManagement from '@/pages/FinancialManagement';
import Tools from '@/pages/Tools';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import NotFound from '@/pages/NotFound';

import ProtectedRoute from '@/components/ProtectedRoute';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/email-verification" element={<EmailVerification />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/profile/:userId" element={<PublicProfile />} />
                
                {/* Admin routes */}
                <Route path="/admin-auth" element={<AdminAuth />} />
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
                
                {/* Protected routes */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/carousel-briefing" element={
                  <ProtectedRoute>
                    <CarouselBriefing />
                  </ProtectedRoute>
                } />
                <Route path="/carousel-generator" element={
                  <ProtectedRoute>
                    <CarouselGenerator />
                  </ProtectedRoute>
                } />
                <Route path="/carousel-result/:sessionId" element={
                  <ProtectedRoute>
                    <CarouselResult />
                  </ProtectedRoute>
                } />
                <Route path="/carousel-creator" element={
                  <ProtectedRoute>
                    <CarouselCreator />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                <Route path="/content-feed" element={
                  <ProtectedRoute>
                    <ContentFeed />
                  </ProtectedRoute>
                } />
                <Route path="/courses" element={
                  <ProtectedRoute>
                    <Courses />
                  </ProtectedRoute>
                } />
                <Route path="/course-overview/:courseId" element={
                  <ProtectedRoute>
                    <CourseOverview />
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
                <Route path="/financial-management" element={
                  <ProtectedRoute>
                    <FinancialManagement />
                  </ProtectedRoute>
                } />
                <Route path="/tools" element={
                  <ProtectedRoute>
                    <Tools />
                  </ProtectedRoute>
                } />
                
                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              <Toaster />
              <Sonner />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

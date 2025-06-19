
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TranslationProvider } from "@/contexts/TranslationContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import Settings from "./pages/Settings";
import CarouselCreator from "./pages/CarouselCreator";
import CarouselBriefing from "./pages/CarouselBriefing";
import CarouselGenerator from "./pages/CarouselGenerator";
import CarouselResult from "./pages/CarouselResult";
import Courses from "./pages/Courses";
import CreateCourse from "./pages/CreateCourse";
import EditCourse from "./pages/EditCourse";
import CourseView from "./pages/CourseView";
import LessonView from "./pages/LessonView";
import ContentFeed from "./pages/ContentFeed";
import Podcasts from "./pages/Podcasts";
import Tools from "./pages/Tools";
import LinkPageEditor from "./pages/LinkPageEditor";
import EmailVerification from "./pages/EmailVerification";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/AdminDashboard";
import FinancialManagement from "./pages/FinancialManagement";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminProtectedRoute } from "./components/AdminProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TranslationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/email-verification" element={<EmailVerification />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/admin-auth" element={<AdminAuth />} />
              <Route 
                path="/profile/:userId" 
                element={
                  <ProtectedRoute>
                    <PublicProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/carousel-creator" 
                element={
                  <ProtectedRoute>
                    <CarouselCreator />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/carousel-briefing" 
                element={
                  <ProtectedRoute>
                    <CarouselBriefing />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/carousel-generator" 
                element={
                  <ProtectedRoute>
                    <CarouselGenerator />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/carousel-result" 
                element={
                  <ProtectedRoute>
                    <CarouselResult />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/link-page-editor" 
                element={
                  <ProtectedRoute>
                    <LinkPageEditor />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/courses" 
                element={
                  <ProtectedRoute>
                    <Courses />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create-course" 
                element={
                  <ProtectedRoute>
                    <CreateCourse />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/edit-course/:courseId" 
                element={
                  <ProtectedRoute>
                    <EditCourse />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/course/:courseId" 
                element={
                  <ProtectedRoute>
                    <CourseView />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/course/:courseId/lesson/:lessonId" 
                element={
                  <ProtectedRoute>
                    <LessonView />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/content-feed" 
                element={
                  <ProtectedRoute>
                    <ContentFeed />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/podcasts" 
                element={
                  <ProtectedRoute>
                    <Podcasts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                } 
              />
              <Route 
                path="/admin/financial" 
                element={
                  <AdminProtectedRoute>
                    <FinancialManagement />
                  </AdminProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TranslationProvider>
    </QueryClientProvider>
  );
}

export default App;

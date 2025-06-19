
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TranslationProvider } from "./contexts/TranslationContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import EmailVerification from "./pages/EmailVerification";
import Settings from "./pages/Settings";
import Courses from "./pages/Courses";
import CourseView from "./pages/CourseView";
import CreateCourse from "./pages/CreateCourse";
import EditCourse from "./pages/EditCourse";
import LessonView from "./pages/LessonView";
import FinancialManagement from "./pages/FinancialManagement";
import Tools from "./pages/Tools";
import CarouselBriefing from "./pages/CarouselBriefing";
import CarouselCreator from "./pages/CarouselCreator";
import CarouselGenerator from "./pages/CarouselGenerator";
import CarouselResult from "./pages/CarouselResult";
import LinkPageEditor from "./pages/LinkPageEditor";
import PublicLinkPage from "./pages/PublicLinkPage";
import ContentFeed from "./pages/ContentFeed";
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import Pricing from "./pages/Pricing";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Podcasts from "./pages/Podcasts";
import NotFound from "./pages/NotFound";

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
              <Route path="/verify-email" element={<EmailVerification />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/podcasts" element={<Podcasts />} />
              
              {/* Rota pública para páginas de link */}
              <Route path="/p/:slug" element={<PublicLinkPage />} />
              
              {/* Rotas protegidas */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/profile/:userId" element={<PublicProfile />} />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/courses" element={
                <ProtectedRoute>
                  <Courses />
                </ProtectedRoute>
              } />
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
              <Route path="/create-course" element={
                <ProtectedRoute>
                  <CreateCourse />
                </ProtectedRoute>
              } />
              <Route path="/edit-course/:courseId" element={
                <ProtectedRoute>
                  <EditCourse />
                </ProtectedRoute>
              } />
              <Route path="/financial" element={
                <ProtectedRoute>
                  <FinancialManagement />
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
              <Route path="/link-page-editor" element={
                <ProtectedRoute>
                  <LinkPageEditor />
                </ProtectedRoute>
              } />
              <Route path="/content-feed" element={
                <ProtectedRoute>
                  <ContentFeed />
                </ProtectedRoute>
              } />
              
              {/* Rotas de administrador */}
              <Route path="/admin" element={<AdminAuth />} />
              <Route path="/admin/dashboard" element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              } />
              
              {/* Página 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TranslationProvider>
    </QueryClientProvider>
  );
}

export default App;

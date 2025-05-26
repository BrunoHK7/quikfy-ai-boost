
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
import Pricing from "./pages/Pricing";
import CarouselGenerator from "./pages/CarouselGenerator";
import CarouselCreator from "./pages/CarouselCreator";
import Podcasts from "./pages/Podcasts";
import ContentFeed from "./pages/ContentFeed";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/carousel-generator" element={
              <ProtectedRoute>
                <CarouselGenerator />
              </ProtectedRoute>
            } />
            <Route path="/carousel-creator" element={
              <ProtectedRoute>
                <CarouselCreator />
              </ProtectedRoute>
            } />
            <Route path="/podcasts" element={
              <ProtectedRoute>
                <Podcasts />
              </ProtectedRoute>
            } />
            <Route path="/content-feed" element={
              <ProtectedRoute>
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

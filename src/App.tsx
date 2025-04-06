
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { WallpaperProvider } from "@/contexts/WallpaperContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WallpaperDetails from "./pages/WallpaperDetails";
import SearchPage from "./pages/SearchPage";
import CategoryPage from "./pages/CategoryPage";
import ProfilePage from "./pages/ProfilePage";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import AddWallpaper from "./pages/admin/AddWallpaper";
import EditWallpaper from "./pages/admin/EditWallpaper";
import Categories from "./pages/Categories";
import NewestWallpapers from "./pages/NewestWallpapers";
import PopularWallpapers from "./pages/PopularWallpapers";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ContactUs from "./pages/ContactUs";

// Create a client for React Query
const queryClient = new QueryClient();

// ScrollToTop component that handles scrolling to top on route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

const AppRoutes = () => (
  <>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/wallpaper/:id" element={<WallpaperDetails />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/category/:category" element={<CategoryPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      
      {/* New Routes */}
      <Route path="/categories" element={<Categories />} />
      <Route path="/newest" element={<NewestWallpapers />} />
      <Route path="/popular" element={<PopularWallpapers />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/contact" element={<ContactUs />} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/wallpaper/add" element={<AddWallpaper />} />
      <Route path="/admin/wallpaper/edit/:id" element={<EditWallpaper />} />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
);

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WallpaperProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </WallpaperProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;

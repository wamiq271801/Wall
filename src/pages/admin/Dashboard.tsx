
import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWallpapers } from "@/contexts/WallpaperContext";
import Header from "@/components/layout/Header";
import WallpaperTable from "@/components/admin/WallpaperTable";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Loader } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { wallpapers, loading, error, deleteWallpaper, refreshWallpapers } = useWallpapers();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    document.title = "Admin Dashboard | WallpaperMarket";
  }, []);
  
  // Redirect if not authenticated or not an admin
  if (!authLoading && (!user || !isAdmin)) {
    return <Navigate to="/admin/login" />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-6 md:py-8 flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Wallpaper Dashboard</h1>
          <div className="flex space-x-3 md:space-x-4">
            <Button 
              variant="outline" 
              onClick={() => refreshWallpapers()}
              disabled={loading}
              size={isMobile ? "sm" : "default"}
            >
              {loading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {!isMobile && "Refresh"}
            </Button>
            <Button asChild size={isMobile ? "sm" : "default"}>
              <Link to="/admin/wallpaper/add">
                <Plus className="h-4 w-4 mr-2" /> {!isMobile && "Add Wallpaper"}
                {isMobile && "Add"}
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base md:text-lg font-medium">Total Wallpapers</h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold mt-2">{wallpapers.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base md:text-lg font-medium">Total Downloads</h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold mt-2">
              {wallpapers.reduce((sum, item) => sum + (item.downloadCount || 0), 0)}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base md:text-lg font-medium">Categories</h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold mt-2">
              {new Set(wallpapers.map((w) => w.category)).size}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 md:p-6 overflow-x-auto">
          <h2 className="text-lg md:text-xl font-semibold mb-4">All Wallpapers</h2>
          <div className="min-w-full">
            <WallpaperTable wallpapers={wallpapers} onDelete={deleteWallpaper} />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;

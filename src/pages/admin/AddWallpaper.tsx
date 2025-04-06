import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWallpapers } from "@/contexts/WallpaperContext";
import Header from "@/components/layout/Header";
import WallpaperForm from "@/components/admin/WallpaperForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Category } from "@/types";
import Footer from "@/components/layout/Footer";
import { useIsMobile } from "@/hooks/use-mobile";

interface WallpaperData {
  title: string;
  category: string;
  resolution: string;
  imageUrl: string;
  imagePath: string;
  description?: string;
  tags?: string[];
}

const AddWallpaper = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { addWallpaper } = useWallpapers();
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

  // Hardcoded list of categories for demo purposes
  const [categories] = useState<Category[]>([
    { id: "1", name: "Nature", slug: "nature" },
    { id: "2", name: "Abstract", slug: "abstract" },
    { id: "3", name: "Technology", slug: "technology" },
    { id: "4", name: "Animals", slug: "animals" },
    { id: "5", name: "Architecture", slug: "architecture" },
    { id: "6", name: "Travel", slug: "travel" },
  ]);

  useEffect(() => {
    document.title = "Add Wallpaper | WallpaperMarket";
    // Uncomment and implement fetching real categories if needed.
    // fetchCategories();
  }, []);

  const handleSubmit = async (wallpaperData: WallpaperData) => {
    setLoading(true);
    try {
      // Validate required fields
      if (
        !wallpaperData.title ||
        !wallpaperData.category ||
        !wallpaperData.resolution ||
        !wallpaperData.imageUrl ||
        !wallpaperData.imagePath
      ) {
        setLoading(false); // Reset loading state on validation error
        throw new Error("Missing required fields");
      }

      // Ensure tags is an array
      if (!Array.isArray(wallpaperData.tags)) {
        wallpaperData.tags = [];
      }

      // Use a separate success callback to ensure loading state is reset
      await addWallpaper(wallpaperData, () => {
        navigate("/admin");
      });
      
      // Reset loading state after successful submission
      setLoading(false);
    } catch (error) {
      console.error("Error adding wallpaper:", error);
      setLoading(false); // Ensure loading state is reset on error
      // Re-throw the error to ensure proper error handling in the form
      throw error;
    }
  };

  // Redirect if not authenticated or not an admin
  if (!authLoading && (!user || !isAdmin)) {
    return <Navigate to="/admin/login" />;
  }

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-6 md:py-8 flex-1">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            onClick={goBack}
            className="mb-4"
            size={isMobile ? "sm" : "default"}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>

          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
              Add New Wallpaper
            </h1>
            <WallpaperForm
              categories={categories}
              onSubmit={handleSubmit}
              isLoading={loading}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AddWallpaper;

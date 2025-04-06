
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWallpapers } from "@/contexts/WallpaperContext";
import Header from "@/components/layout/Header";
import WallpaperForm from "@/components/admin/WallpaperForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader } from "lucide-react";
import { Category, Wallpaper } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Footer from "@/components/layout/Footer";
import { useIsMobile } from "@/hooks/use-mobile";

const EditWallpaper = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { updateWallpaper } = useWallpapers();
  const isMobile = useIsMobile();
  
  const [wallpaper, setWallpaper] = useState<Wallpaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Same hardcoded categories as in AddWallpaper
  const categories = [
    { id: "1", name: "Nature", slug: "nature" },
    { id: "2", name: "Abstract", slug: "abstract" },
    { id: "3", name: "Technology", slug: "technology" },
    { id: "4", name: "Animals", slug: "animals" },
    { id: "5", name: "Architecture", slug: "architecture" },
    { id: "6", name: "Travel", slug: "travel" },
  ];
  
  useEffect(() => {
    document.title = "Edit Wallpaper | WallpaperMarket";
    
    const fetchWallpaper = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          setError("Wallpaper not found");
          setLoading(false);
          return;
        }
        
        const wallpaperDoc = await getDoc(doc(db, "wallpapers", id));
        
        if (!wallpaperDoc.exists()) {
          setError("Wallpaper not found");
          setLoading(false);
          return;
        }
        
        setWallpaper({
          id: wallpaperDoc.id,
          ...wallpaperDoc.data(),
        } as Wallpaper);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching wallpaper:", err);
        setError("Failed to load wallpaper");
      } finally {
        setLoading(false);
      }
    };
    
    fetchWallpaper();
  }, [id]);
  
  const handleSubmit = async (wallpaperData: any) => {
    if (!id) return;
    
    setSaving(true);
    try {
      await updateWallpaper(id, wallpaperData);
      navigate("/admin");
    } catch (error) {
      console.error("Error updating wallpaper:", error);
      // Ensure loading state is reset even when there's an error
      setSaving(false);
      return Promise.reject(error); // Propagate the error back to the form
    }
  };
  
  // Redirect if not authenticated or not an admin
  if (!authLoading && (!user || !isAdmin)) {
    return <Navigate to="/admin/login" />;
  }
  
  const goBack = () => {
    navigate(-1); // Navigate to previous page in history
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
            <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Edit Wallpaper</h1>
            
            {loading ? (
              <div className="flex justify-center py-8 md:py-12">
                <Loader className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="py-6 text-center">
                <p className="text-red-500">{error}</p>
                <Button onClick={goBack} className="mt-4">
                  Back to Dashboard
                </Button>
              </div>
            ) : wallpaper ? (
              <WallpaperForm 
                wallpaper={wallpaper} 
                categories={categories} 
                onSubmit={handleSubmit} 
                isLoading={saving}
              />
            ) : null}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EditWallpaper;

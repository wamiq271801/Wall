
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Wallpaper } from "@/types";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WallpaperGrid from "@/components/wallpapers/WallpaperGrid";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchWallpapersByCategory = async () => {
      if (!category) return;
      
      setLoading(true);
      try {
        const wallpaperQuery = query(
          collection(db, "wallpapers"),
          where("category", "==", category)
        );
        
        const querySnapshot = await getDocs(wallpaperQuery);
        const wallpaperList: Wallpaper[] = [];
        
        querySnapshot.forEach((doc) => {
          wallpaperList.push({
            id: doc.id,
            ...doc.data()
          } as Wallpaper);
        });
        
        setWallpapers(wallpaperList);
      } catch (error) {
        console.error("Error fetching wallpapers by category:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWallpapersByCategory();
    document.title = `${category} Wallpapers | WallpaperMarket`;
  }, [category]);
  
  const goBack = () => {
    navigate(-1); // This will navigate to the previous page in history
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={goBack} 
            className="mb-4 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          
          <h1 className="text-4xl font-bold">{category} Wallpapers</h1>
          <p className="text-gray-600 mt-2">
            Browse our collection of {category?.toLowerCase()} wallpapers
          </p>
        </div>
        
        <WallpaperGrid wallpapers={wallpapers} loading={loading} />
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;


import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WallpaperGrid from "@/components/wallpapers/WallpaperGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Heart } from "lucide-react";
import { Wallpaper } from "@/types";

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const [favoriteWallpapers, setFavoriteWallpapers] = useState<Wallpaper[]>([]);
  const [downloadedWallpapers, setDownloadedWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "My Profile | WallpaperMarket";
    
    const fetchUserData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // In a real app, you'd have a user profile document with favorites and downloads
        // For now, we'll just fetch some random wallpapers as a placeholder
        const wallpaperSnapshot = await getDocs(collection(db, "wallpapers"));
        const allWallpapers: Wallpaper[] = [];
        
        wallpaperSnapshot.forEach((doc) => {
          allWallpapers.push({
            id: doc.id,
            ...doc.data()
          } as Wallpaper);
        });
        
        // Simulate favorites (first 5 wallpapers)
        setFavoriteWallpapers(allWallpapers.slice(0, 5));
        
        // Simulate downloads (next 5 wallpapers)
        setDownloadedWallpapers(allWallpapers.slice(5, 10));
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);
  
  // Redirect if not authenticated
  if (!authLoading && !user) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          {user && (
            <p className="text-gray-600 mt-2">Welcome back, {user.displayName || user.email}</p>
          )}
        </div>
        
        <Tabs defaultValue="favorites" className="mb-8">
          <TabsList>
            <TabsTrigger value="favorites" className="flex items-center">
              <Heart className="h-4 w-4 mr-2" /> Favorites
            </TabsTrigger>
            <TabsTrigger value="downloads" className="flex items-center">
              <Download className="h-4 w-4 mr-2" /> Downloaded
            </TabsTrigger>
          </TabsList>
          <TabsContent value="favorites" className="mt-6">
            <WallpaperGrid wallpapers={favoriteWallpapers} loading={loading} />
          </TabsContent>
          <TabsContent value="downloads" className="mt-6">
            <WallpaperGrid wallpapers={downloadedWallpapers} loading={loading} />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;

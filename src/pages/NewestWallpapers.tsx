
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WallpaperGrid from "@/components/wallpapers/WallpaperGrid";
import { useWallpapers } from "@/contexts/WallpaperContext";

const NewestWallpapers = () => {
  const { wallpapers, loading } = useWallpapers();
  const [sortedWallpapers, setSortedWallpapers] = useState([]);
  
  useEffect(() => {
    if (wallpapers.length > 0) {
      const sorted = [...wallpapers].sort(
        (a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
      );
      setSortedWallpapers(sorted);
    }
  }, [wallpapers]);
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Newest Wallpapers</h1>
          <p className="text-gray-600 mb-8">The latest additions to our collection</p>
          
          <WallpaperGrid wallpapers={sortedWallpapers} loading={loading} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NewestWallpapers;

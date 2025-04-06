
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WallpaperGrid from "@/components/wallpapers/WallpaperGrid";
import { useWallpapers } from "@/contexts/WallpaperContext";
import { ScrollArea } from "@/components/ui/scroll-area";

const PopularWallpapers = () => {
  const { wallpapers, loading } = useWallpapers();
  const [sortedWallpapers, setSortedWallpapers] = useState([]);
  
  useEffect(() => {
    if (wallpapers.length > 0) {
      const sorted = [...wallpapers].sort(
        (a, b) => (b.downloadCount || 0) - (a.downloadCount || 0)
      );
      setSortedWallpapers(sorted);
    }
  }, [wallpapers]);
  
  return (
    <div className="flex min-h-screen flex-col scrollbar-none">
      <Header />
      
      <main className="flex-1 py-12 scrollbar-none">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Popular Wallpapers</h1>
          <p className="text-gray-600 mb-8">Our most downloaded and favorite wallpapers</p>
          
          <ScrollArea className="scrollbar-none">
            <WallpaperGrid wallpapers={sortedWallpapers} loading={loading} />
          </ScrollArea>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PopularWallpapers;

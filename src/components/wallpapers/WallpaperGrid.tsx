
import { useEffect, useState } from "react";
import { Wallpaper } from "@/types";
import WallpaperCard from "./WallpaperCard";
import { Loader } from "lucide-react";

interface WallpaperGridProps {
  wallpapers: Wallpaper[];
  loading: boolean;
}

const WallpaperGrid = ({ wallpapers, loading }: WallpaperGridProps) => {
  const [visibleWallpapers, setVisibleWallpapers] = useState<Wallpaper[]>([]);
  const [page, setPage] = useState(1);
  const wallpapersPerPage = 12;

  // Load more wallpapers when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500
      ) {
        if (visibleWallpapers.length < wallpapers.length) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleWallpapers.length, wallpapers.length]);

  // Update visible wallpapers when wallpapers or page changes
  useEffect(() => {
    setVisibleWallpapers(
      wallpapers.slice(0, page * wallpapersPerPage)
    );
  }, [page, wallpapers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!wallpapers || wallpapers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-medium">No wallpapers found</h3>
        <p className="text-gray-500">Check back soon for new content</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-12">
      {visibleWallpapers.map((wallpaper) => (
        <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} />
      ))}
      
      {visibleWallpapers.length < wallpapers.length && (
        <div className="col-span-full flex justify-center py-8">
          <Loader className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};

export default WallpaperGrid;

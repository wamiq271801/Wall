
import { useState } from "react";
import { Link } from "react-router-dom";
import { Wallpaper } from "@/types";
import { getImageUrl } from "@/lib/imagekit";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface WallpaperCardProps {
  wallpaper: Wallpaper;
}

const WallpaperCard = ({ wallpaper }: WallpaperCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const imageUrl = wallpaper.imageUrl || getImageUrl(wallpaper.imagePath, 400, 300);

  return (
    <Link 
      to={`/wallpaper/${wallpaper.id}`}
      className="group relative overflow-hidden rounded-lg shadow-md transition-all hover:shadow-lg"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
      <div
        className={cn(
          "aspect-[3/2] w-full transition-opacity",
          isLoading ? "opacity-0" : "opacity-100"
        )}
      >
        <img
          src={imageUrl}
          alt={wallpaper.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onLoad={() => setIsLoading(false)}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
        <h3 className="text-white text-lg font-medium line-clamp-1">{wallpaper.title}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-white/80 text-xs">{wallpaper.resolution}</span>
          <Badge variant="secondary" className="text-xs">{wallpaper.category}</Badge>
        </div>
      </div>
    </Link>
  );
};

export default WallpaperCard;

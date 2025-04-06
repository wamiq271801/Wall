import { useState } from "react";
import { Wallpaper } from "@/types";
import { getImageUrl } from "@/lib/imagekit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, Heart, Fullscreen, X } from "lucide-react";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface WallpaperDetailProps {
  wallpaper: Wallpaper;
}

const WallpaperDetail = ({ wallpaper }: WallpaperDetailProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [liked, setLiked] = useState(false);
  const { toast } = useToast();

  const imageUrl = wallpaper.imageUrl || getImageUrl(wallpaper.imagePath, 1920, 1080, 100);
  
  const handleDownload = async () => {
    try {
      // Increment download count in Firestore
      const wallpaperRef = doc(db, "wallpapers", wallpaper.id);
      await updateDoc(wallpaperRef, {
        downloadCount: increment(1)
      });
      
      // Download image
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `${wallpaper.title.replace(/\s+/g, "-").toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: "Your wallpaper download has started",
      });
    } catch (error) {
      console.error("Error downloading:", error);
      toast({
        title: "Download failed",
        description: "There was an error downloading the wallpaper",
        variant: "destructive",
      });
    }
  };
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: wallpaper.title,
          text: `Check out this beautiful wallpaper: ${wallpaper.title}`,
          url: window.location.href,
        });
      } else {
        // Fallback
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Wallpaper link copied to clipboard",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  const toggleLike = () => {
    setLiked(!liked);
    toast({
      title: liked ? "Removed from favorites" : "Added to favorites",
      description: liked ? "Wallpaper removed from your favorites" : "Wallpaper added to your favorites",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className={`relative rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 bg-black flex items-center justify-center' : ''}`}>
            <img
              src={imageUrl}
              alt={wallpaper.title}
              className={`w-full h-auto ${isFullscreen ? 'max-h-screen object-contain' : 'object-cover rounded-lg shadow-lg'}`}
            />
            {isFullscreen && (
              <Button
                variant="outline"
                size="icon"
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70"
                onClick={toggleFullscreen}
              >
                <X className="h-5 w-5 text-white" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{wallpaper.title}</h1>
            {wallpaper.description && (
              <p className="mt-2 text-gray-600">{wallpaper.description}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Resolution</h3>
              <p>{wallpaper.resolution}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Downloads</h3>
              <p>{wallpaper.downloadCount || 0}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Category</h3>
              <p>{wallpaper.category}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {wallpaper.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <Button className="w-full" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            
            <div className="grid grid-cols-3 gap-4">
              <Button variant="outline" onClick={toggleLike}>
                <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={toggleFullscreen}>
                <Fullscreen className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WallpaperDetail;

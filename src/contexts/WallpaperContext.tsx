import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  collection, 
  query, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  orderBy,
  serverTimestamp,
  DocumentData
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Wallpaper } from "../types";
import { useToast } from "@/hooks/use-toast";

interface WallpaperContextType {
  wallpapers: Wallpaper[];
  loading: boolean;
  error: string | null;
  addWallpaper: (wallpaper: Omit<Wallpaper, "id" | "createdAt" | "updatedAt" | "downloadCount">, onSuccess?: () => void) => Promise<void>;
  updateWallpaper: (id: string, wallpaper: Partial<Wallpaper>) => Promise<void>;
  deleteWallpaper: (id: string) => Promise<void>;
  refreshWallpapers: () => Promise<void>;
}

const WallpaperContext = createContext<WallpaperContextType>({
  wallpapers: [],
  loading: false,
  error: null,
  addWallpaper: async () => {},
  updateWallpaper: async () => {},
  deleteWallpaper: async () => {},
  refreshWallpapers: async () => {},
});

export const useWallpapers = () => useContext(WallpaperContext);

export const WallpaperProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchWallpapers = async () => {
    try {
      setLoading(true);
      const wallpaperQuery = query(
        collection(db, "wallpapers"),
        orderBy("createdAt", "desc")
      );
      
      const querySnapshot = await getDocs(wallpaperQuery);
      const wallpaperList: Wallpaper[] = [];
      
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as DocumentData;
        wallpaperList.push({
          id: docSnap.id,
          ...data,
        } as Wallpaper);
      });
      
      setWallpapers(wallpaperList);
      setError(null);
    } catch (err) {
      console.error("Error fetching wallpapers:", err);
      setError("Failed to fetch wallpapers");
      toast({
        title: "Error",
        description: "Failed to load wallpapers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addWallpaper = async (wallpaper: Omit<Wallpaper, "id" | "createdAt" | "updatedAt" | "downloadCount">, onSuccess?: () => void) => {
    try {
      // Validate required fields
      if (!wallpaper.title || !wallpaper.category || !wallpaper.resolution || !wallpaper.imageUrl || !wallpaper.imagePath) {
        throw new Error("Missing required fields");
      }
  
      // Ensure tags is an array
      const tags = Array.isArray(wallpaper.tags) ? wallpaper.tags : [];
  
      // Create the wallpaper document with proper type casting
      const wallpaperData = {
        title: wallpaper.title,
        description: wallpaper.description || "",
        category: wallpaper.category,
        resolution: wallpaper.resolution,
        imageUrl: wallpaper.imageUrl,
        imagePath: wallpaper.imagePath,
        tags: tags,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        downloadCount: 0
      };
  
      const docRef = await addDoc(collection(db, "wallpapers"), wallpaperData);
      
      // Only show success toast and refresh if the document was created
      if (docRef.id) {
        toast({
          title: "Success",
          description: "Wallpaper added successfully",
        });
        
        await fetchWallpapers();
        
        // Call the success callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error("Failed to create wallpaper document");
      }
    } catch (err) {
      console.error("Error adding wallpaper:", err);
      toast({
        title: "Error",
        description: "Failed to add wallpaper",
        variant: "destructive",
      });
      // Re-throw the error to ensure proper error handling in the form component
      throw err;
    }
  };

  const updateWallpaper = async (id: string, wallpaper: Partial<Wallpaper>) => {
    try {
      const wallpaperRef = doc(db, "wallpapers", id);
      await updateDoc(wallpaperRef, {
        ...wallpaper,
        updatedAt: serverTimestamp(),
      });
      
      toast({
        title: "Success",
        description: "Wallpaper updated successfully",
      });
      
      await fetchWallpapers();
    } catch (err) {
      console.error("Error updating wallpaper:", err);
      toast({
        title: "Error",
        description: "Failed to update wallpaper",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteWallpaper = async (id: string) => {
    try {
      await deleteDoc(doc(db, "wallpapers", id));
      
      toast({
        title: "Success",
        description: "Wallpaper deleted successfully",
      });
      
      await fetchWallpapers();
    } catch (err) {
      console.error("Error deleting wallpaper:", err);
      toast({
        title: "Error",
        description: "Failed to delete wallpaper",
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchWallpapers();
  }, []);

  const value = {
    wallpapers,
    loading,
    error,
    addWallpaper,
    updateWallpaper,
    deleteWallpaper,
    refreshWallpapers: fetchWallpapers,
  };

  return <WallpaperContext.Provider value={value}>{children}</WallpaperContext.Provider>;
};

import { useState } from "react";
import { Wallpaper, Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader, X } from "lucide-react";
import { uploadImage } from "@/lib/upload-helpers";

interface WallpaperFormProps {
  wallpaper?: Partial<Wallpaper>;
  categories: Category[];
  onSubmit: (wallpaper: Partial<Wallpaper>) => Promise<void>;
  isLoading?: boolean;
}

const WallpaperForm = ({
  wallpaper,
  categories,
  onSubmit,
  isLoading = false,
}: WallpaperFormProps) => {
  const [title, setTitle] = useState(wallpaper?.title || "");
  const [description, setDescription] = useState(wallpaper?.description || "");
  const [category, setCategory] = useState(wallpaper?.category || "");
  const [tags, setTags] = useState(wallpaper?.tags?.join(", ") || "");
  const [resolution, setResolution] = useState(wallpaper?.resolution || "");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(wallpaper?.imageUrl || "");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const processImageUpload = async (): Promise<{ url: string; path: string } | null> => {
    if (!imageFile) {
      // For existing wallpapers, use the already uploaded image if available
      if (wallpaper?.imageUrl && wallpaper?.imagePath) {
        return {
          url: wallpaper.imageUrl,
          path: wallpaper.imagePath,
        };
      }
      toast({
        title: "Image required",
        description: "Please select an image to upload",
        variant: "destructive",
      });
      return null;
    }

    setIsUploading(true);
    try {
      const result = await uploadImage(imageFile, `wallpaper_${Date.now()}`, (progress) => {
        setUploadProgress(progress);
      });

      if (!result || !result.url || !result.filePath) {
        throw new Error('Invalid upload result');
      }

      setIsUploading(false);
      setUploadProgress(0);

      return {
        url: result.url,
        path: result.filePath,
      };
    } catch (error) {
      console.error("Image upload failed:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading the image",
        variant: "destructive",
      });
      setIsUploading(false);
      setUploadProgress(0);
      throw error; // Propagate the error to ensure proper error handling
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title) {
      toast({
        title: "Title required",
        description: "Please enter a title for the wallpaper",
        variant: "destructive",
      });
      return;
    }

    if (!category) {
      toast({
        title: "Category required",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }

    if (!resolution) {
      toast({
        title: "Resolution required",
        description: "Please enter the resolution (e.g., 1920x1080)",
        variant: "destructive",
      });
      return;
    }

    // Validate resolution format
    const resolutionRegex = /^\d+x\d+$/;
    if (!resolutionRegex.test(resolution)) {
      toast({
        title: "Invalid resolution format",
        description: "Resolution must be in format: widthxheight (e.g., 1920x1080)",
        variant: "destructive",
      });
      return;
    }

    // For new wallpapers or when updating with a new image
    if ((!wallpaper?.id && !imageFile) || (imageFile && !previewUrl)) {
      toast({
        title: "Image required",
        description: "Please select an image to upload",
        variant: "destructive",
      });
      return;
    }

    try {
      let imageData = null;
      
      // Only process image upload if there's a new image file
      if (imageFile) {
        try {
          imageData = await processImageUpload();
          if (!imageData) {
            toast({
              title: "Upload failed",
              description: "Failed to process image upload",
              variant: "destructive",
            });
            return;
          }
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
          toast({
            title: "Upload failed",
            description: "There was an error uploading the image",
            variant: "destructive",
          });
          return;
        }
      }

      const tagsList = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const wallpaperData: Partial<Wallpaper> = {
        title,
        description: description || "",
        category,
        tags: tagsList,
        resolution,
        imageUrl: imageData?.url || wallpaper?.imageUrl || "",
        imagePath: imageData?.path || wallpaper?.imagePath || "",
        // Ensure these fields are properly typed for Firebase
        createdAt: wallpaper?.createdAt,
        updatedAt: wallpaper?.updatedAt,
        downloadCount: wallpaper?.downloadCount || 0
      };

      // Ensure we have image data either from upload or existing wallpaper
      if (!wallpaperData.imageUrl || !wallpaperData.imagePath) {
        toast({
          title: "Image data missing",
          description: "Failed to process image data",
          variant: "destructive",
        });
        return;
      }

      await onSubmit(wallpaperData);
    } catch (error) {
      console.error("Error submitting wallpaper:", error);
      toast({
        title: "Error",
        description: "Failed to submit wallpaper",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          placeholder="Enter wallpaper title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="resolution">Resolution *</Label>
          <Input
            id="resolution"
            placeholder="e.g., 1920x1080"
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          placeholder="nature, mountains, sunset, etc."
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Wallpaper Image *</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Click to upload or drag and drop</span>
                <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (max 10MB)</span>
              </label>
            </div>

            {isUploading && (
              <div className="mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Uploading...</span>
                  <span className="text-sm text-gray-500">{uploadProgress.toFixed(0)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {previewUrl && (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Wallpaper preview"
                className="h-40 w-full object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => {
                  // Revoke the object URL to free up memory
                  if (previewUrl.startsWith("blob:")) {
                    URL.revokeObjectURL(previewUrl);
                  }
                  setPreviewUrl("");
                  setImageFile(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || isUploading}>
        {isLoading || isUploading ? (
          <Loader className="h-4 w-4 mr-2 animate-spin" />
        ) : null}
        {wallpaper?.id ? "Update Wallpaper" : "Add Wallpaper"}
      </Button>
    </form>
  );
};

export default WallpaperForm;
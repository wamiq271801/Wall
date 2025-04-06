import imagekit from "./imagekit";

interface ImageKitResponse {
  url: string;
  filePath: string;
  fileId?: string;
  name?: string;
}

// Helper function for handling image uploads with ImageKit
export const uploadImage = async (
  file: File,
  fileName: string,
  onProgress?: (progress: number) => void
): Promise<{ url: string; filePath: string }> => {
  if (!file) {
    throw new Error("No file provided for upload");
  }

  try {
    // Fetch authentication parameters from our server
    const authResponse = await fetch("http://localhost:3000/api/imagekit-auth");
    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      throw new Error(`Authentication failed: ${authResponse.statusText}. ${errorText}`);
    }

    const authData = await authResponse.json();

    return new Promise<{ url: string; filePath: string }>((resolve, reject) => {
      imagekit.upload({
        file,
        fileName,
        useUniqueFileName: true,
        folder: "/wallpapers",
        // Add authentication parameters
        token: authData.token,
        signature: authData.signature,
        expire: authData.expire,
        onError: (err) => {
          console.error("Upload error:", err);
          reject(err);
        },
        onSuccess: (response: ImageKitResponse) => {
          resolve({
            url: response.url,
            filePath: response.filePath,
          });
        },
        onProgress: (progress: { loaded: number; total: number }) => {
          if (onProgress) {
            onProgress((progress.loaded / progress.total) * 100);
          }
        },
      });
    });
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};

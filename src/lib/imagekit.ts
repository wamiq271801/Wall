import ImageKit from "imagekit-javascript";

// Load environment variables
const IMAGEKIT_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const IMAGEKIT_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

// Initialize ImageKit
export const imagekit = new ImageKit({
  publicKey: IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: IMAGEKIT_URL_ENDPOINT,
  authenticationEndpoint: "http://localhost:3000/api/imagekit-auth"
});

// Generate an ImageKit URL for image transformations
export const getImageUrl = (
  path: string, 
  width: number = 400, 
  height: number = 300, 
  quality: number = 90
) => {
  return imagekit.url({
    path,
    transformation: [
      { width, height, quality }
    ],
  });
};

export default imagekit;

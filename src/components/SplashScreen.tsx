
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ScrollArea } from "./ui/scroll-area";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 - prev) / 10;
        return newProgress > 99 ? 100 : newProgress;
      });
    }, 100);

    // Set timeout to complete the splash screen
    const timer = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      // Add a short delay before hiding the splash screen
      setTimeout(() => {
        setShow(false);
        onComplete();
      }, 500);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="relative w-full max-w-md px-8">
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-24 h-24 mb-6">
            <div className="loader"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                className="w-12 h-12 text-primary"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5zm10-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM5 14a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H5zm9 0a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-4z" 
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent animate-fade-in">
            WallpaperMarket
          </h1>
          
          <p className="text-sm text-gray-500 mt-2 mb-8 animate-fade-in" style={{ animationDelay: "300ms" }}>
            Premium Wallpapers
          </p>

          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
            />
          </div>
          
          <p className="text-xs text-gray-400 mt-3 animate-fade-in" style={{ animationDelay: "500ms" }}>
            Loading amazing wallpapers for you...
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default SplashScreen;

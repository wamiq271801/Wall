
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Footer = () => {
  const year = new Date().getFullYear();
  const isMobile = useIsMobile();
  
  return (
    <footer className="bg-secondary/30 py-8 md:py-12 mt-8 md:mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                className="w-6 h-6 text-primary"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5zm10-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM5 14a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H5zm9 0a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-4z" 
                  fill="currentColor"
                />
              </svg>
              <span className="font-bold text-lg md:text-xl">WallpaperMarket</span>
            </Link>
            <p className="mt-3 md:mt-4 text-xs md:text-sm text-gray-600 max-w-md">
              Discover and download beautiful high-resolution wallpapers for your
              desktop, mobile, and tablet devices.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium text-base md:text-lg mb-2 md:mb-4">Links</h3>
            <ul className="space-y-1 md:space-y-2">
              <li>
                <Link to="/" className="text-xs md:text-sm text-gray-600 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-xs md:text-sm text-gray-600 hover:text-primary transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/newest" className="text-xs md:text-sm text-gray-600 hover:text-primary transition-colors">
                  Newest
                </Link>
              </li>
              <li>
                <Link to="/popular" className="text-xs md:text-sm text-gray-600 hover:text-primary transition-colors">
                  Popular
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium text-base md:text-lg mb-2 md:mb-4">Legal</h3>
            <ul className="space-y-1 md:space-y-2">
              <li>
                <Link to="/privacy" className="text-xs md:text-sm text-gray-600 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-xs md:text-sm text-gray-600 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-xs md:text-sm text-gray-600 hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-6 md:mt-8 pt-4 md:pt-8">
          <p className="text-xs md:text-sm text-gray-600 text-center">
            &copy; {year} WallpaperMarket. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

const Header = () => {
  const { user, isAdmin, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/category/Nature", label: "Nature" },
    { path: "/category/Abstract", label: "Abstract" },
    { path: "/category/Technology", label: "Technology" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4">
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
            <span className="font-bold text-xl hidden sm:inline">WallpaperMarket</span>
            <span className="font-bold text-xl sm:hidden">WM</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 mx-6">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className={cn(
                "text-sm font-medium transition-colors",
                location.pathname === link.path ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center ml-auto space-x-4">
          {/* Desktop Search Form */}
          <form onSubmit={handleSearch} className="hidden md:flex relative w-[200px]">
            <Input
              type="search"
              placeholder="Search wallpapers..."
              className="pr-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0 h-full"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {/* Admin Links */}
          {isAdmin && (
            <Link to="/admin">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                Dashboard
              </Button>
              <Button variant="outline" size="icon" className="sm:hidden">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5zm10-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM5 14a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H5zm9 0a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-4z" 
                    fill="currentColor"
                  />
                </svg>
              </Button>
            </Link>
          )}

          {/* Authentication Buttons */}
          {user ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => logout()}
              className="hidden sm:flex"
            >
              Log out
            </Button>
          ) : (
            <Link to="/admin/login">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <User className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>
          )}

          {/* Mobile Menu using Sheet component instead of Drawer */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] max-w-sm">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              
              <div className="py-6 flex flex-col space-y-6">
                {/* Mobile Search Form */}
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="search"
                    placeholder="Search wallpapers..."
                    className="w-full pr-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button 
                    type="submit" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-0 top-0 h-full"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </form>

                {/* Mobile Navigation */}
                <div className="flex flex-col space-y-3">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.path}
                      to={link.path} 
                      className={cn(
                        "text-lg font-medium py-2",
                        location.pathname === link.path ? "text-primary" : "hover:text-primary"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                
                {/* Mobile-specific actions */}
                {isAdmin && (
                  <Link 
                    to="/admin"
                    className="w-full mt-4"
                  >
                    <Button variant="outline" className="w-full">
                      Dashboard
                    </Button>
                  </Link>
                )}
                
                {user ? (
                  <Button 
                    variant="outline" 
                    onClick={() => logout()}
                    className="w-full mt-4"
                  >
                    Log out
                  </Button>
                ) : (
                  <Link 
                    to="/admin/login"
                    className="w-full mt-4"
                  >
                    <Button variant="outline" className="w-full">
                      <User className="h-4 w-4 mr-2" />
                      Admin Login
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;

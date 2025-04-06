import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WallpaperGrid from "@/components/wallpapers/WallpaperGrid";
import SplashScreen from "@/components/SplashScreen";
import { useWallpapers } from "@/contexts/WallpaperContext";
import { Button } from "@/components/ui/button";
import { Search, Download, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Index = () => {
  const { wallpapers, loading } = useWallpapers();
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState("featured");
  
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (hasVisited) {
      setShowSplash(false);
    } else {
      sessionStorage.setItem("hasVisited", "true");
    }
  }, []);
  
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const totalWallpapers = wallpapers.length;
  const totalDownloads = wallpapers.reduce((sum, item) => sum + (item.downloadCount || 0), 0);
  
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newThisWeek = wallpapers.filter(wallpaper => {
    if (!wallpaper.createdAt) return false;
    const wallpaperDate = wallpaper.createdAt.toDate ? 
      wallpaper.createdAt.toDate() : new Date(wallpaper.createdAt);
    return wallpaperDate > oneWeekAgo;
  }).length;

  const categories = [
    { name: "Nature", slug: "Nature", gradient: "from-green-300 to-green-600", icon: "🌿" },
    { name: "Abstract", slug: "Abstract", gradient: "from-purple-300 to-purple-600", icon: "🎨" },
    { name: "Technology", slug: "Technology", gradient: "from-blue-300 to-blue-600", icon: "💻" },
    { name: "Animals", slug: "Animals", gradient: "from-amber-300 to-amber-600", icon: "🦁" },
    { name: "Architecture", slug: "Architecture", gradient: "from-gray-300 to-gray-600", icon: "🏛️" },
    { name: "Travel", slug: "Travel", gradient: "from-teal-300 to-teal-600", icon: "✈️" },
  ];

  const statCards = [
    { 
      title: "Wallpapers", 
      value: `${totalWallpapers}+`, 
      icon: <Download className="h-5 w-5 text-emerald-500" />, 
      color: "bg-emerald-50" 
    },
    { 
      title: "Downloads", 
      value: `${totalDownloads}+`, 
      icon: <TrendingUp className="h-5 w-5 text-blue-500" />, 
      color: "bg-blue-50" 
    },
    { 
      title: "New This Week", 
      value: newThisWeek.toString(), 
      icon: <Clock className="h-5 w-5 text-purple-500" />, 
      color: "bg-purple-50" 
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      
      <div className="flex min-h-screen flex-col scrollbar-none">
        <Header />
        
        <main className="flex-1">
          <section className="relative bg-gradient-to-br from-primary/90 to-primary/60 py-16 md:py-24">
            <div className="absolute inset-0 bg-grid-white/10 bg-fixed mix-blend-soft-light"></div>
            <div className="container mx-auto px-4 relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto text-center"
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                  Stunning Wallpapers for Every Device
                </h1>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Discover and download high-quality wallpapers that transform your screens
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="text-base font-medium">
                    <Link to="/search">
                      <Search className="mr-2 h-5 w-5" /> Search Wallpapers
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="bg-white/20 text-white border-white/30 hover:bg-white/30 text-base font-medium">
                    <Link to="/newest">
                      <Clock className="mr-2 h-5 w-5" /> Newest Wallpapers
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>

            <div className="container mx-auto px-4 mt-12">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {statCards.map((card, index) => (
                  <motion.div 
                    key={index} 
                    variants={item}
                    className={`${card.color} rounded-lg p-6 shadow-sm backdrop-blur-sm border border-white/20`}
                  >
                    <div className="flex items-center">
                      <div className="bg-white rounded-full p-3 mr-4">
                        {card.icon}
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">{card.title}</p>
                        <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          <section className="py-16 container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Browse Categories</h2>
              <Link to="/categories" className="text-primary flex items-center hover:underline">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <Carousel className="w-full">
              <CarouselContent className="-ml-4">
                {categories.map((category) => (
                  <CarouselItem key={category.name} className="pl-4 md:basis-1/3 lg:basis-1/6">
                    <Link 
                      to={`/category/${encodeURIComponent(category.name)}`}
                      className="block"
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-0">
                          <div className={`aspect-square w-full bg-gradient-to-br ${category.gradient} flex flex-col items-center justify-center p-4 text-center`}>
                            <span className="text-4xl mb-2">{category.icon}</span>
                            <h3 className="text-white font-medium text-lg">{category.name}</h3>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </section>
          
          <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <h2 className="text-3xl font-bold mb-4 md:mb-0">Discover Wallpapers</h2>
                
                <Tabs defaultValue="featured" className="w-full md:w-auto" onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="featured">Featured</TabsTrigger>
                    <TabsTrigger value="popular">Popular</TabsTrigger>
                    <TabsTrigger value="new">New</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
                <TabsContent value="featured" className="mt-0">
                  <WallpaperGrid wallpapers={wallpapers} loading={loading} />
                </TabsContent>
                <TabsContent value="popular" className="mt-0">
                  <WallpaperGrid 
                    wallpapers={[...wallpapers].sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))}
                    loading={loading}
                  />
                </TabsContent>
                <TabsContent value="new" className="mt-0">
                  <WallpaperGrid 
                    wallpapers={[...wallpapers].sort((a, b) => {
                      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
                      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
                      return dateB.getTime() - dateA.getTime();
                    })}
                    loading={loading}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </section>

          <section className="py-16 container mx-auto px-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 shadow-lg">
              <div className="max-w-xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
                <p className="text-white/90 mb-6">Get notified when we add new wallpapers to our collection</p>
                <form className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-grow px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  />
                  <Button type="submit" className="px-6 py-3">Subscribe</Button>
                </form>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Index;

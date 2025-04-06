
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const Categories = () => {
  const categories = [
    { name: "Nature", slug: "Nature", gradient: "from-green-300 to-green-600", icon: "🌿", description: "Beautiful landscapes, forests, oceans, and more" },
    { name: "Abstract", slug: "Abstract", gradient: "from-purple-300 to-purple-600", icon: "🎨", description: "Creative and colorful abstract designs" },
    { name: "Technology", slug: "Technology", gradient: "from-blue-300 to-blue-600", icon: "💻", description: "Cutting-edge tech and digital art" },
    { name: "Animals", slug: "Animals", gradient: "from-amber-300 to-amber-600", icon: "🦁", description: "Wildlife and pet wallpapers" },
    { name: "Architecture", slug: "Architecture", gradient: "from-gray-300 to-gray-600", icon: "🏛️", description: "Buildings, landmarks and architectural marvels" },
    { name: "Travel", slug: "Travel", gradient: "from-teal-300 to-teal-600", icon: "✈️", description: "Destinations from around the world" },
    { name: "Space", slug: "Space", gradient: "from-indigo-300 to-indigo-600", icon: "🌠", description: "Galaxies, planets, and cosmic wonders" },
    { name: "Minimal", slug: "Minimal", gradient: "from-slate-300 to-slate-600", icon: "◻️", description: "Simple, clean, and minimalist designs" },
    { name: "Flowers", slug: "Flowers", gradient: "from-pink-300 to-pink-600", icon: "🌸", description: "Beautiful floral photography" },
    { name: "Cars", slug: "Cars", gradient: "from-red-300 to-red-600", icon: "🚗", description: "Luxury and sports automobiles" },
    { name: "Fantasy", slug: "Fantasy", gradient: "from-violet-300 to-violet-600", icon: "🧙", description: "Magical and fantastical scenes" },
    { name: "Food", slug: "Food", gradient: "from-orange-300 to-orange-600", icon: "🍕", description: "Delicious food photography" },
  ];
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">All Categories</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.name}
                to={`/category/${encodeURIComponent(category.slug)}`}
                className="block"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className={`aspect-video w-full bg-gradient-to-br ${category.gradient} flex flex-col items-center justify-center p-6 text-center`}>
                      <span className="text-5xl mb-3">{category.icon}</span>
                      <h2 className="text-white font-medium text-xl mb-1">{category.name}</h2>
                      <p className="text-white/80 text-sm">{category.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Categories;

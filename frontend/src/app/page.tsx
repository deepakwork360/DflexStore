"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ShoppingBag, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import axiosInstance from "@/lib/axios";
import { Loader } from "@/components/ui/Loader";

// Fallback Product Data in case the API is empty
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    title: "Aura Premium Headphones",
    price: "$299",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2965&auto=format&fit=crop",
    tag: "New Arrival",
  },
  {
    id: 2,
    title: "Nova Smart Watch",
    price: "$199",
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=2640&auto=format&fit=crop",
    tag: "Bestseller",
  },
  {
    id: 3,
    title: "Lumina Minimalist Desk Lamp",
    price: "$89",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=2787&auto=format&fit=crop",
    tag: "Trending",
  },
  {
    id: 4,
    title: "Apex Mechanical Keyboard",
    price: "$149",
    image:
      "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=2942&auto=format&fit=crop",
    tag: "Enthusiast Choice",
  },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/products");
        if (res.data.success) {
          // Take only the first 3 products for the hero section
          setProducts(res.data.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Use real data if available, otherwise use fallback data to maintain layout
  const featured = products.length > 0 ? products : [];

  // Safe helper to get the display data for a specific slot (0, 1, or 2)
  const getProductData = (index: number) => {
    if (featured[index]) {
      const p = featured[index];
      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        price: p.variants?.[0]?.price
          ? `$${p.variants[0].price.toFixed(2)}`
          : "$0.00",
        image:
          p.images?.[0]?.url ||
          FALLBACK_PRODUCTS[index]?.image ||
          "https://placehold.co/600x600?text=No+Image",
        tag: index === 0 ? "Featured" : "",
      };
    }
    // Return fallback if product doesn't exist at index
    return {
      ...FALLBACK_PRODUCTS[Math.min(index, FALLBACK_PRODUCTS.length - 1)],
      id: `fallback-${index}`,
      slug: "products", // Default slug for fallbacks
    };
  };

  const mainProduct = getProductData(0);
  const sideProduct1 = getProductData(1);
  const sideProduct2 = getProductData(2);

  return (
    <>
      {isLoading && <Loader fullScreen />}
      <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden text-white font-sans selection:bg-indigo-500/30">
        {/* Background Gradients & Effects */}
        <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[150px]" />
          <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[60%] h-[20%] rounded-[100%] bg-blue-500/10 blur-[100px]" />
        </motion.div>

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 z-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <main
          ref={containerRef}
          className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 lg:pt-32 pb-16"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Hero Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col space-y-8"
            >
              <div className="inline-flex items-center space-x-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium backdrop-blur-md w-fit">
                <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                <span className="text-gray-300">
                  Welcome to the future of retail
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
                Elevate Your <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-blue-400">
                  Digital Lifestyle.
                </span>
              </h1>

              <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
                Discover a curated collection of premium tech, minimalist
                accessories, and everyday carry essentials designed for the
                modern remote professional.
              </p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <Link href="/products" className="group">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-purple-500 text-black hover:bg-purple-400 hover:text-black rounded-full h-14 px-8 text-base shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all"
                  >
                    Shop Collection
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="w-full sm:w-auto rounded-full h-14 px-8 text-base border border-white/10 hover:bg-white/5 backdrop-blur-md text-white"
                  >
                    Explore Categories
                  </Button>
                </Link>
              </motion.div>

              {/* Social Proof */}
              <div className="flex items-center gap-6 pt-8 border-t border-white/10 mt-8">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] bg-gray-600 overflow-hidden relative"
                    >
                      <img
                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center text-yellow-400">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Trusted by{" "}
                    <span className="text-white font-medium">10,000+</span>{" "}
                    customers
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Hero Right - Glassmorphism Carousel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, type: "spring" }}
              className="relative lg:h-[600px] flex items-center"
            >
              {/* Main Feature Card */}
              <Link
                href={`/products/${mainProduct.slug}`}
                className="w-full block"
              >
                <div className="relative w-full aspect-4/5 sm:aspect-square lg:aspect-4/5 rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 flex flex-col justify-between group">
                  {/* Top Meta */}
                  <div className="flex justify-between items-start relative z-20">
                    {mainProduct.tag ? (
                      <span className="inline-flex items-center space-x-1 rounded-full bg-black/40 px-3 py-1 text-xs font-medium backdrop-blur-md text-white border border-white/10">
                        <Zap className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{mainProduct.tag}</span>
                      </span>
                    ) : (
                      <div></div>
                    )}
                    <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors">
                      <ShoppingBag className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Product Image */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center p-12 z-10"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <img
                      src={mainProduct.image}
                      alt={mainProduct.title}
                      className="w-full h-full object-cover rounded-2xl shadow-xl mix-blend-normal"
                    />
                  </motion.div>

                  {/* Bottom Content (Glass Footer) */}
                  <div className="relative z-20 mt-auto rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-5 overflow-hidden before:absolute before:inset-0 before:bg-linear-to-t before:from-black/60 before:to-transparent before:z-[-1]">
                    <div className="flex justify-between items-end gap-2">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white line-clamp-1">
                          {mainProduct.title}
                        </h3>
                        <p className="text-sm text-gray-300 mt-1">
                          Trending now
                        </p>
                      </div>
                      <p className="text-2xl font-light text-white shrink-0">
                        {mainProduct.price}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Floating Decorative Elements */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut",
                }}
                className="absolute -right-8 top-12 md:-right-12 md:top-20 hidden sm:block"
              >
                <Link href={`/products/${sideProduct1.slug}`}>
                  <div className="w-32 h-32 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md p-4 flex flex-col items-center justify-center gap-2 shadow-2xl rotate-12 hover:rotate-0 transition-transform cursor-pointer">
                    <img
                      src={sideProduct1.image}
                      className="w-16 h-16 object-cover rounded-xl"
                      alt={sideProduct1.title}
                    />
                    <span className="text-xs font-medium px-2 py-1 bg-white/10 rounded-full whitespace-nowrap">
                      {sideProduct1.price}
                    </span>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 7,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -left-4 bottom-16 md:-left-12 md:bottom-24 hidden sm:block"
              >
                <Link href={`/products/${sideProduct2.slug}`}>
                  <div className="w-28 h-28 rounded-full bg-white/5 border border-white/10 backdrop-blur-md p-3 flex flex-col items-center justify-center shadow-2xl -rotate-6 hover:rotate-0 transition-transform cursor-pointer">
                    <img
                      src={sideProduct2.image}
                      className="w-16 h-16 object-cover rounded-full"
                      alt={sideProduct2.title}
                    />
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
}

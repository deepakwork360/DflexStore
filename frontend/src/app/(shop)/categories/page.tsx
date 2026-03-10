"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Loader } from "@/components/ui/Loader";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/categories");
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (error) {
        toast.error("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (isLoading) return <Loader fullScreen />;

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden text-white font-sans selection:bg-indigo-500/30">
      {/* Animated Background Gradients & Effects */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[150px]" />
        <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[60%] h-[20%] rounded-[100%] bg-blue-500/10 blur-[100px]" />
      </motion.div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">
              Shop by Category
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl">
              Browse our curated collections of premium products carefully
              organized for your lifestyle.
            </p>
          </motion.div>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            No categories found.
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 gap-y-6 gap-x-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link
                  href={`/products?category=${category.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white/5 border border-white/10 group-hover:shadow-[0_0_25px_rgba(99,102,241,0.2)] group-hover:border-white/20 transition-all duration-300">
                    {category.imageUrl ? (
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out mix-blend-normal"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/20 to-purple-500/20 group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                    )}

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                    {/* Content aligned to bottom */}
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col justify-end translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-1 drop-shadow-md line-clamp-1">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="hidden sm:block text-xs sm:text-sm text-gray-300 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                          {category.description}
                        </p>
                      )}
                      <span className="mt-2 text-xs sm:text-sm font-semibold text-indigo-300 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                        Explore{" "}
                        <ArrowRight className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

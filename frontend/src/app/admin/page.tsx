"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/Loader";
import axiosInstance from "@/lib/axios";
import {
  PackageSearch,
  Tag,
  PlusCircle,
  LayoutDashboard,
  Edit,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { CategoryForm } from "./components/CategoryForm";
import { ProductForm } from "./components/ProductForm";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

type Tab = "dashboard" | "products" | "categories";

export default function AdminPage() {
  const { user, isLoading: isAuthLoading } = useAuthStore();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  useEffect(() => {
    // Only fetch if admin
    if (!isAuthLoading && user?.role !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }

    if (user?.role === "ADMIN") {
      fetchAdminData();
    }
  }, [user, isAuthLoading, router]);

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      const [prodRes, catRes] = await Promise.all([
        axiosInstance.get("/products"),
        axiosInstance.get("/categories"),
      ]);

      if (prodRes.data.success)
        setProducts(prodRes.data.data.products || prodRes.data.data || []);
      if (catRes.data.success) setCategories(catRes.data.data || []);
    } catch (error) {
      toast.error("Failed to load admin data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await axiosInstance.delete(`/categories/${id}`);
      toast.success("Category deleted");
      fetchAdminData();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axiosInstance.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchAdminData();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: PackageSearch },
    { id: "categories", label: "Categories", icon: Tag },
  ] as const;

  if (isAuthLoading || isLoading) return <Loader fullScreen />;
  if (user?.role !== "ADMIN") return null;

  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-hidden bg-white dark:bg-[#030303]">
      {/* Premium Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center md:text-left"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Admin{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-600">
              Control Panel
            </span>
          </h1>
          <p className="mt-3 text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
            Streamlined management for your premium boutique. Control your
            inventory, categories, and settings with ease.
          </p>
        </motion.div>

        {/* Navigation Tabs - Modern Glassmorphism */}
        <div className="mb-10 p-1.5 bg-gray-200/50 dark:bg-white/5 backdrop-blur-xl rounded-2xl inline-flex border border-gray-200 dark:border-white/10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`
                  relative flex items-center py-2.5 px-6 rounded-xl text-sm font-bold transition-all duration-300
                  ${
                    isActive
                      ? "text-white shadow-lg"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl shadow-indigo-500/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center">
                  <Icon
                    className={`mr-2 h-4 w-4 ${isActive ? "text-white" : ""}`}
                  />
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "dashboard" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="relative overflow-hidden bg-white/40 dark:bg-white/5 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl flex items-center justify-between hover:scale-[1.02] transition-transform group"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <PackageSearch className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                      <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                        Total Products
                      </p>
                      <div className="text-5xl font-extrabold text-gray-900 dark:text-white mt-2">
                        <AnimatedNumber value={products.length} />
                      </div>
                      <div className="mt-4 flex items-center text-xs font-bold text-green-500">
                        <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2" />
                        Inventory Active
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      className="relative z-10 h-16 w-16 bg-linear-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30"
                    >
                      <PackageSearch className="w-8 h-8 text-white" />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative overflow-hidden bg-white/40 dark:bg-white/5 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl flex items-center justify-between hover:scale-[1.02] transition-transform group"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Tag className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                      <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                        Total Categories
                      </p>
                      <div className="text-5xl font-extrabold text-gray-900 dark:text-white mt-2">
                        <AnimatedNumber value={categories.length} />
                      </div>
                      <div className="mt-4 flex items-center text-xs font-bold text-purple-500">
                        <span className="flex h-2 w-2 rounded-full bg-purple-500 mr-2" />
                        Collections Organized
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: -10 }}
                      className="relative z-10 h-16 w-16 bg-linear-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30"
                    >
                      <Tag className="w-8 h-8 text-white" />
                    </motion.div>
                  </motion.div>
                </div>
              )}

              {activeTab === "products" && (
                <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row justify-between items-center bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 p-6 rounded-3xl gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Products Market
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total {products.length} listed items.
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setEditingProduct(null);
                        setIsProductFormOpen(true);
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl shadow-xl shadow-indigo-500/25 hover:opacity-90 transition-all uppercase tracking-wide"
                    >
                      <PlusCircle className="mr-2 w-5 h-5" /> Add New Product
                    </motion.button>
                  </div>

                  <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-white/5">
                        <thead>
                          <tr className="bg-gray-100/50 dark:bg-white/5">
                            <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                              Product Details
                            </th>
                            <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                              Category
                            </th>
                            <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                              Status
                            </th>
                            <th className="px-8 py-5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                              Manage
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-white/5 bg-transparent">
                          {products.length === 0 ? (
                            <tr>
                              <td
                                colSpan={4}
                                className="px-8 py-12 text-center text-sm text-gray-500 dark:text-gray-400 italic"
                              >
                                No products found. Time to list some treasures!
                              </td>
                            </tr>
                          ) : (
                            products.map((prod, index) => (
                              <motion.tr
                                key={prod.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="hover:bg-white/50 dark:hover:bg-white/10 transition-colors group/row"
                              >
                                <td className="px-8 py-5 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="h-14 w-14 shrink-0 rounded-2xl bg-gray-200 dark:bg-zinc-800 border border-white/20 overflow-hidden shadow-sm group-hover/row:scale-110 transition-transform duration-500">
                                      {prod.images?.[0] ? (
                                        <img
                                          src={prod.images[0].url}
                                          alt=""
                                          className="h-full w-full object-cover"
                                        />
                                      ) : (
                                        <PackageSearch className="h-full w-full p-3 text-gray-400" />
                                      )}
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-base font-bold text-gray-900 dark:text-white group-hover/row:text-indigo-600 dark:group-hover/row:text-indigo-400 transition-colors">
                                        {prod.title}
                                      </div>
                                      <div className="text-xs text-gray-500 font-mono mt-0.5 opacity-60">
                                        {prod.slug}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-8 py-5 whitespace-nowrap">
                                  <span className="px-3 py-1 inline-flex text-[10px] leading-5 font-extrabold uppercase tracking-widest rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                                    {prod.category?.name || "Boutique"}
                                  </span>
                                </td>
                                <td className="px-8 py-5 whitespace-nowrap">
                                  <span className="flex items-center text-sm text-green-600 dark:text-green-400 font-bold">
                                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2.5 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                    Listed
                                  </span>
                                </td>
                                <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex items-center justify-end space-x-3">
                                    <motion.button
                                      whileHover={{ scale: 1.1, y: -2 }}
                                      onClick={() => {
                                        setEditingProduct(prod);
                                        setIsProductFormOpen(true);
                                      }}
                                      className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm transition-all"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.1, y: -2 }}
                                      onClick={() =>
                                        handleDeleteProduct(prod.id)
                                      }
                                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm transition-all"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </motion.button>
                                  </div>
                                </td>
                              </motion.tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "categories" && (
                <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row justify-between items-center bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 p-6 rounded-3xl gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Category Studios
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {categories.length} curated collections.
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setEditingCategory(null);
                        setIsCategoryFormOpen(true);
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-linear-to-r from-purple-600 to-pink-600 rounded-xl shadow-xl shadow-purple-500/25 hover:opacity-90 transition-all uppercase tracking-wide"
                    >
                      <PlusCircle className="mr-2 w-5 h-5" /> Design Category
                    </motion.button>
                  </div>

                  <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                    <ul className="divide-y divide-gray-200 dark:divide-white/5">
                      {categories.length === 0 ? (
                        <li className="px-8 py-12 text-center text-sm text-gray-500 dark:text-gray-400 italic">
                          No categories found yet. Start sketching!
                        </li>
                      ) : (
                        categories.map((cat, index) => (
                          <motion.li
                            key={cat.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="px-8 py-5 hover:bg-white/50 dark:hover:bg-white/10 transition-colors group/row"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-5">
                                {cat.imageUrl && (
                                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/20 shadow-sm shrink-0 group-hover/row:scale-110 transition-transform duration-500">
                                    <img
                                      src={cat.imageUrl}
                                      className="w-full h-full object-cover"
                                      alt=""
                                    />
                                  </div>
                                )}
                                <div>
                                  <p className="text-lg font-bold text-gray-900 dark:text-white group-hover/row:text-purple-600 dark:group-hover/row:text-purple-400 transition-colors">
                                    {cat.name}
                                  </p>
                                  <p className="text-xs text-gray-500 font-mono mt-0.5 opacity-60">
                                    {cat.slug}
                                  </p>
                                </div>
                              </div>
                              <div className="flex space-x-3">
                                <motion.button
                                  whileHover={{ scale: 1.1, y: -2 }}
                                  onClick={() => {
                                    setEditingCategory(cat);
                                    setIsCategoryFormOpen(true);
                                  }}
                                  className="p-2.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm transition-all"
                                >
                                  <Edit className="w-5 h-5" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1, y: -2 }}
                                  onClick={() => handleDeleteCategory(cat.id)}
                                  className="p-2.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm transition-all"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </motion.button>
                              </div>
                            </div>
                          </motion.li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <CategoryForm
        isOpen={isCategoryFormOpen}
        onClose={() => setIsCategoryFormOpen(false)}
        category={editingCategory}
        onSuccess={fetchAdminData}
      />

      <ProductForm
        isOpen={isProductFormOpen}
        onClose={() => setIsProductFormOpen(false)}
        product={editingProduct}
        categories={categories}
        onSuccess={fetchAdminData}
      />
    </div>
  );
}

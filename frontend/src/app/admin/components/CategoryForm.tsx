import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
import { X, Loader2, Image as ImageIcon, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category?: any;
  onSuccess: () => void;
}

export function CategoryForm({
  isOpen,
  onClose,
  category,
  onSuccess,
}: CategoryFormProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
      setImagePreview(category.imageUrl || null);
    } else {
      setName("");
      setSlug("");
      setImageFile(null);
      setImagePreview(null);
    }
  }, [category, isOpen]);

  // Auto-generate slug from name
  useEffect(() => {
    if (!category && name) {
      setSlug(
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, ""),
      );
    }
  }, [name, category]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", slug);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (category) {
        await axiosInstance.put(`/categories/${category.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Category updated successfully!");
      } else {
        await axiosInstance.post("/categories", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Category created successfully!");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save category.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-2xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-white/60 dark:bg-zinc-900/60 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden border border-white/40 dark:border-white/10 z-10"
          >
            <div className="px-8 py-7 border-b border-gray-200/50 dark:border-white/10 flex justify-between items-center bg-white/40 dark:bg-white/5">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                {category ? "Modify" : "Create"}{" "}
                <span className="text-indigo-500">Category</span>
              </h2>
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2.5 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-2xl hover:bg-white dark:hover:bg-white/10 transition-all border border-transparent hover:border-gray-200 dark:hover:border-white/10"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-7">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-[0.2em] ml-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-3 border border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-black/40 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-400 font-medium"
                  placeholder="e.g. Luxury Timepieces"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-[0.2em] ml-1">
                  Access Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-5 py-3 border border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-black/40 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono text-sm"
                  placeholder="luxury-timepieces"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-[0.2em] ml-1">
                  Thematic Visual
                </label>
                <div className="flex items-center space-x-6">
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      borderColor: "rgba(99, 102, 241, 0.5)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-28 h-28 rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/40 flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-all shadow-inner"
                    onClick={() =>
                      document.getElementById("category-image-upload")?.click()
                    }
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Category Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <ImageIcon className="w-8 h-8 text-gray-300 mb-1" />
                        <span className="text-[10px] font-bold text-gray-400">
                          UPLOAD
                        </span>
                      </div>
                    )}
                    <input
                      id="category-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </motion.div>
                  <div className="flex-1 text-[11px] text-gray-500 dark:text-gray-400 space-y-2">
                    <p className="font-bold text-gray-700 dark:text-gray-300">
                      Compositional Guidelines
                    </p>
                    <ul className="list-disc list-inside opacity-70">
                      <li>Square Aspect Ratio</li>
                      <li>High Contrast preferred</li>
                      <li>Max 5MB Optimal</li>
                    </ul>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="mt-2 text-red-500 hover:text-red-400 font-black uppercase tracking-tighter flex items-center"
                      >
                        <Trash2 className="w-3 h-3 mr-1" /> Reset Visual
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-6 flex justify-end space-x-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-sm font-black text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm hover:bg-white dark:hover:bg-white/10 transition-all uppercase tracking-widest"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, opacity: 0.9 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 text-sm font-black text-white bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                >
                  {isLoading && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {category ? "Commit Changes" : "Create Masterpiece"}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

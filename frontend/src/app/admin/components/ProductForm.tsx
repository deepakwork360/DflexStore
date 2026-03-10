import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
import { X, Loader2, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
  categories: any[];
  onSuccess: () => void;
}

export function ProductForm({
  isOpen,
  onClose,
  product,
  categories,
  onSuccess,
}: ProductFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // For new products
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [variants, setVariants] = useState([
    { sku: "", price: 0, stock: 0, size: "", color: "" },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setTitle(product.title || "");
      setDescription(product.description || "");
      setSlug(product.slug || "");
      setBrand(product.brand || "");
      setCategoryId(product.categoryId || "");
      // Not populating variants/images for edit as per current backend support
    } else {
      setTitle("");
      setDescription("");
      setSlug("");
      setBrand("");
      setCategoryId("");
      setImages([]);
      setImagePreviews([]);
      setVariants([{ sku: "", price: 0, stock: 0, size: "", color: "" }]);
    }
  }, [product, isOpen]);

  // Auto-generate slug
  useEffect(() => {
    if (!product && title) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, ""),
      );
    }
  }, [title, product]);

  if (!isOpen) return null;

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      { sku: "", price: 0, stock: 0, size: "", color: "" },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (images.length + newFiles.length > 5) {
        toast.error(
          `You can only upload up to 5 images. You selected ${images.length + newFiles.length}.`,
        );
        return;
      }
      const updatedImages = [...images, ...newFiles].slice(0, 5);
      setImages(updatedImages);

      const newPreviews = updatedImages.map((file) =>
        URL.createObjectURL(file),
      );
      setImagePreviews(newPreviews);

      // Reset input
      e.target.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);

    // Revoke the old object URL to prevent memory leaks if possible
    URL.revokeObjectURL(imagePreviews[index]);

    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !categoryId) {
      toast.error(
        "Please fill in all required fields (Title, Slug, Category).",
      );
      return;
    }

    setIsLoading(true);
    try {
      if (product) {
        // Edit mode (basic details only as per backend)
        await axiosInstance.put(`/products/${product.id}`, {
          title,
          description,
          slug,
          brand,
          categoryId,
        });
        toast.success("Product updated successfully!");
      } else {
        // Create mode
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("slug", slug);
        formData.append("brand", brand);
        formData.append("categoryId", categoryId);
        formData.append("variants", JSON.stringify(variants));

        if (images.length > 0) {
          images.forEach((file) => {
            formData.append("images", file);
          });
        }

        await axiosInstance.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product created successfully!");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save product.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-2xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden border border-white/40 dark:border-white/10 z-10 my-8"
          >
            <div className="px-10 py-8 border-b border-gray-200/50 dark:border-white/10 flex justify-between items-center bg-white/40 dark:bg-white/5">
              <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  {product ? "Refine" : "Forge"}{" "}
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-600">
                    Product
                  </span>
                </h2>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">
                  {product
                    ? `Editor ID: ${product.id}`
                    : "Conceptualizing new inventory"}
                </p>
              </div>
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-3 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-2xl hover:bg-white dark:hover:bg-white/10 transition-all border border-transparent hover:border-gray-200 dark:hover:border-white/10"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-10 space-y-10 max-h-[70vh] overflow-y-auto scrollbar-hide"
            >
              {/* Basic Information */}
              <section className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-2 w-8 bg-linear-to-r from-indigo-500 to-purple-600 rounded-full" />
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                    Architectural Details
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-[0.2em] ml-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-6 py-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-black/40 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold placeholder:text-gray-300"
                      placeholder="Product Designation"
                      required
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-[0.2em] ml-1">
                      Collection
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-6 py-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-black/40 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select Studio Collection</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-[0.2em] ml-1">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full px-6 py-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-black/40 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono text-sm"
                      placeholder="slug-path"
                      required
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-[0.2em] ml-1">
                      Brand
                    </label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full px-6 py-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-black/40 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold"
                      placeholder="Brand Identity"
                    />
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-[0.2em] ml-1">
                    Description Narrative
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-6 py-4 border border-gray-200 dark:border-white/10 rounded-3xl bg-white/50 dark:bg-black/40 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium leading-relaxed"
                    placeholder="Elaborate on the craftsmanship..."
                    required
                  />
                </motion.div>
              </section>

              {/* Media Management - Only for new products or as supported */}
              {!product && (
                <section className="space-y-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="h-2 w-8 bg-linear-to-r from-purple-500 to-pink-600 rounded-full" />
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                      Visual Assets
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {imagePreviews.map((url, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative aspect-square rounded-3xl overflow-hidden border border-white/20 shadow-lg group"
                      >
                        <img
                          src={url}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          alt=""
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-xl transform translate-y-[-120%] group-hover:translate-y-0 transition-transform shadow-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                    {imagePreviews.length < 5 && (
                      <motion.div
                        whileHover={{
                          scale: 1.05,
                          borderColor: "rgba(99, 102, 241, 0.4)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          document.getElementById("product-images")?.click()
                        }
                        className="aspect-square rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/20 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white/80 dark:hover:bg-black/40"
                      >
                        <Plus className="w-8 h-8 text-gray-300 mb-1" />
                        <span className="text-[10px] font-black text-gray-400">
                          ADD MEDIA
                        </span>
                      </motion.div>
                    )}
                    <input
                      id="product-images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </section>
              )}

              {/* Variant Engineering */}
              {!product && (
                <section className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-8 bg-linear-to-r from-teal-400 to-emerald-500 rounded-full" />
                      <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                        Variant Engineering
                      </h3>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleAddVariant}
                      className="px-4 py-2 text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100 dark:border-indigo-500/20 uppercase tracking-widest"
                    >
                      Add Component
                    </motion.button>
                  </div>

                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {variants.map((variant, index) => (
                        <motion.div
                          key={index}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="p-6 rounded-[2rem] bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 shadow-xl"
                        >
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="col-span-2 md:col-span-1">
                              <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-widest">
                                SKU
                              </label>
                              <input
                                type="text"
                                value={variant.sku}
                                onChange={(e) =>
                                  handleVariantChange(
                                    index,
                                    "sku",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-4 py-3 bg-white/50 dark:bg-black/40 border border-gray-100 dark:border-white/5 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                placeholder="SKU"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-widest">
                                Size
                              </label>
                              <input
                                type="text"
                                value={variant.size}
                                onChange={(e) =>
                                  handleVariantChange(
                                    index,
                                    "size",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-4 py-3 bg-white/50 dark:bg-black/40 border border-gray-100 dark:border-white/5 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                placeholder="M"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-widest">
                                Color
                              </label>
                              <input
                                type="text"
                                value={variant.color}
                                onChange={(e) =>
                                  handleVariantChange(
                                    index,
                                    "color",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-4 py-3 bg-white/50 dark:bg-black/40 border border-gray-100 dark:border-white/5 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                placeholder="Onyx"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-widest">
                                Price
                              </label>
                              <input
                                type="number"
                                value={variant.price}
                                onChange={(e) =>
                                  handleVariantChange(
                                    index,
                                    "price",
                                    parseFloat(e.target.value),
                                  )
                                }
                                className="w-full px-4 py-3 bg-white/50 dark:bg-black/40 border border-gray-100 dark:border-white/5 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                placeholder="0.00"
                                step="0.01"
                              />
                            </div>
                            <div className="flex items-end space-x-3">
                              <div className="flex-1">
                                <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-widest">
                                  Stock
                                </label>
                                <input
                                  type="number"
                                  value={variant.stock}
                                  onChange={(e) =>
                                    handleVariantChange(
                                      index,
                                      "stock",
                                      parseInt(e.target.value),
                                    )
                                  }
                                  className="w-full px-4 py-3 bg-white/50 dark:bg-black/40 border border-gray-100 dark:border-white/5 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                  placeholder="0"
                                />
                              </div>
                              {variants.length > 1 && (
                                <motion.button
                                  whileHover={{
                                    scale: 1.1,
                                    backgroundColor: "#fee2e2",
                                  }}
                                  whileTap={{ scale: 0.9 }}
                                  type="button"
                                  onClick={() => handleRemoveVariant(index)}
                                  className="p-3 text-red-400 bg-white/50 dark:bg-white/5 rounded-2xl border border-white/20"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </section>
              )}

              {/* Action Suite */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-10 flex flex-col sm:flex-row gap-4 border-t border-gray-200/50 dark:border-white/10"
              >
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgba(0,0,0,0.05)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="px-8 py-4 text-xs font-black text-gray-500 dark:text-gray-400 bg-white/30 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl uppercase tracking-widest transition-all"
                >
                  Discard Changes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, opacity: 0.9 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 inline-flex items-center justify-center px-10 py-4 text-sm font-black text-white bg-linear-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-2xl shadow-indigo-500/40 border border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                >
                  {isLoading && (
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  )}
                  {product ? "Deploy Refinements" : "Initiate Product"}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ProductForm;

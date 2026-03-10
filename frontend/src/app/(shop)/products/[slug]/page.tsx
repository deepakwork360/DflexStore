"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Loader } from "@/components/ui/Loader";
import { Button } from "@/components/ui/Button";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function SingleProductPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [mainSwiper, setMainSwiper] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync main Swiper with activeImage clicks
  useEffect(() => {
    if (mainSwiper && activeImage && product?.images) {
      const index = product.images.findIndex(
        (img: any) => img.url === activeImage,
      );
      if (index !== -1 && mainSwiper.activeIndex !== index) {
        mainSwiper.slideTo(index);
      }
    }
  }, [activeImage, mainSwiper, product]);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        const res = await axiosInstance.get(`/products/${slug}`);
        if (res.data.success) {
          const fetchedProduct = res.data.data;
          setProduct(fetchedProduct);
          // Auto-select first active variant if available
          if (fetchedProduct.variants?.length > 0) {
            setSelectedVariant(fetchedProduct.variants[0]);
          }
        }
      } catch (error) {
        toast.error("Product not found");
        router.push("/products");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [slug, router]);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    if (selectedVariant.stock < quantity) {
      toast.error(`Only ${selectedVariant.stock} left in stock.`);
      return;
    }

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      name: product.title,
      price: selectedVariant.price,
      quantity,
      image: product.images?.[0]?.url,
      stock: selectedVariant.stock,
    });
    toast.success("Added to cart");
  };

  if (isLoading) return <Loader fullScreen />;
  if (!product) return null;

  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen pt-20">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:max-w-7xl lg:px-8">
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to shopping
        </button>

        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12">
          {/* Image gallery */}
          <div className="flex flex-col">
            <div className="aspect-h-1 aspect-w-1 w-full rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm transition-all duration-300">
              {product.images?.length > 0 ? (
                <Swiper
                  onSwiper={setMainSwiper}
                  onSlideChange={(swiper) => {
                    const currentImg = product.images[swiper.activeIndex]?.url;
                    if (currentImg && currentImg !== activeImage) {
                      setActiveImage(currentImg);
                    }
                  }}
                  spaceBetween={10}
                  className="w-full h-full absolute inset-0"
                >
                  {product.images.map((image: any, index: number) => (
                    <SwiperSlide key={image.id || index}>
                      <img
                        src={image.url}
                        alt={`${product.title} view ${index + 1}`}
                        className="h-full w-full object-cover object-center"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-3">
                {product.images.slice(0, 5).map((image: any, index: number) => {
                  const isActive =
                    (activeImage || product.images[0].url) === image.url;
                  return (
                    <button
                      key={image.id || index}
                      onClick={() => setActiveImage(image.url)}
                      className={`relative aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 transition-all duration-200 ${
                        isActive
                          ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-[#0a0a0a]"
                          : "ring-1 ring-gray-200 dark:ring-white/10 hover:ring-gray-300 dark:hover:ring-white/30 hover:opacity-100 opacity-70"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${product.title} view ${index + 1}`}
                        className="h-full w-full object-cover object-center"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {product.title}
            </h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl font-light tracking-tight text-gray-900 dark:text-gray-100">
                ${selectedVariant?.price?.toFixed(2) || "0.00"}
              </p>
            </div>

            <div className="mt-8">
              {/* Variant Picker */}
              {product.variants?.length > 1 && (
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Select Option
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.variants.map((variant: any) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`rounded-md border px-4 py-2 text-sm font-medium uppercase shadow-sm ${
                          selectedVariant?.id === variant.id
                            ? "border-transparent bg-blue-600 text-white hover:bg-blue-700"
                            : "border-gray-200 dark:border-white/10 bg-white dark:bg-transparent text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5"
                        }`}
                      >
                        {variant.size || variant.sku}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Section (Glass UI) */}
              <div className="p-6 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-none">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium">
                    {selectedVariant?.stock > 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        In stock and ready to ship
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        Out of stock
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Quantity */}
                  <div className="relative shrink-0 h-14">
                    <select
                      id="quantity"
                      className="block w-24 h-full appearance-none rounded-xl border border-gray-300 dark:border-white/20 bg-white/60 dark:bg-black/40 pl-4 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:text-sm text-gray-900 dark:text-white font-medium shadow-sm transition-all cursor-pointer"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    >
                      {Array.from(
                        { length: Math.min(10, selectedVariant?.stock || 0) },
                        (_, i) => i + 1,
                      ).map((n) => (
                        <option
                          key={n}
                          value={n}
                          className="bg-white dark:bg-[#1a1a1a]"
                        >
                          {n}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    size="lg"
                    className="w-full flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] rounded-xl"
                    onClick={handleAddToCart}
                    disabled={!selectedVariant || selectedVariant.stock === 0}
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Add to bag
                  </Button>
                </div>
              </div>
            </div>

            {/* Description at the end */}
            <div className="mt-12 border-t border-gray-200 dark:border-white/10 pt-10">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                Product Description
              </h3>
              <div
                className="space-y-6 text-base text-gray-600 dark:text-gray-300 leading-relaxed prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

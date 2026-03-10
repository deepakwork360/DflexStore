"use client";

import React, { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

// Matches Backend Schema
interface Product {
  id: string;
  title: string;
  description: string;
  slug: string;
  images: { id: string; url: string }[];
  variants: {
    id: string;
    sku: string;
    price: number;
    stock: number;
    color?: string;
    size?: string;
  }[];
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = category ? `/products?category=${category}` : "/products";
        const res = await axiosInstance.get(url);
        if (res.data.success) {
          setProducts(res.data.data);
        }
      } catch (error) {
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handleAddToCart = (product: Product) => {
    // For simplicity in UI, we grab the first variant.
    // Usually, you'd show a modal to pick size/color if variant count > 1
    const variant = product.variants[0];
    const image = product.images[0]?.url;

    if (!variant || variant.stock <= 0) {
      toast.error("Out of stock");
      return;
    }

    addItem({
      variantId: variant.id,
      productId: product.id,
      name: product.title,
      price: variant.price,
      quantity: 1,
      image,
      stock: variant.stock,
    });
    toast.success("Added to cart");
  };

  if (isLoading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-8 capitalize">
        {category
          ? `${category.replace(/-/g, " ")} Products`
          : "Latest Arrivals"}
      </h1>

      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative border rounded-lg p-4 shadow-sm hover:shadow-md transition flex flex-col h-full"
          >
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-64 shrink-0">
              {product.images?.[0] ? (
                <img
                  src={product.images[0].url}
                  alt={product.title}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-500 bg-gray-100">
                  No Image
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-between gap-4">
              <div className="flex-1">
                <h3
                  className="text-sm text-gray-700 dark:text-gray-200 font-medium line-clamp-2 min-h-[40px]"
                  title={product.title}
                >
                  <a href={`/products/${product.slug}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.title}
                  </a>
                </h3>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 shrink-0">
                ${product.variants[0]?.price.toFixed(2) || "N/A"}
              </p>
            </div>
            <div className="pt-4 z-10 relative mt-auto">
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleAddToCart(product);
                }}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

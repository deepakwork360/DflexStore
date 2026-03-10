"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Your cart is empty
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Button onClick={() => router.push("/products")} className="mt-6">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        Shopping Cart
      </h1>

      <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <section aria-labelledby="cart-heading" className="lg:col-span-7">
          <ul
            role="list"
            className="divide-y divide-gray-200 border-b border-t border-gray-200 dark:divide-gray-700 dark:border-gray-700"
          >
            {items.map((item) => (
              <li key={item.variantId} className="flex py-6 sm:py-10">
                <div className="shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-24 rounded-md object-cover object-center sm:h-32 sm:w-32"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-md bg-gray-200 sm:h-32 sm:w-32" />
                  )}
                </div>

                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-sm">
                          <a
                            href={`/products/${item.productId}`}
                            className="font-medium text-gray-700 hover:text-gray-800 dark:text-gray-200"
                          >
                            {item.name}
                          </a>
                        </h3>
                      </div>
                      <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9">
                      <label
                        htmlFor={`quantity-${item.variantId}`}
                        className="sr-only"
                      >
                        Quantity, {item.name}
                      </label>
                      <select
                        id={`quantity-${item.variantId}`}
                        name={`quantity-${item.variantId}`}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.variantId, Number(e.target.value))
                        }
                        className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                      >
                        {Array.from(
                          { length: Math.min(10, item.stock) },
                          (_, i) => i + 1,
                        ).map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>

                      <div className="absolute right-0 top-0">
                        <button
                          type="button"
                          className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                          onClick={() => removeItem(item.variantId)}
                        >
                          <span className="sr-only">Remove</span>
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Order summary */}
        <section
          aria-labelledby="summary-heading"
          className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8 dark:bg-gray-800"
        >
          <h2
            id="summary-heading"
            className="text-lg font-medium text-gray-900 dark:text-gray-100"
          >
            Order summary
          </h2>

          <dl className="mt-6 space-y-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center justify-between">
              <dt>Subtotal</dt>
              <dd className="font-medium text-gray-900 dark:text-gray-100">
                ${calculateTotal().toFixed(2)}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
              <dt className="text-base font-medium text-gray-900 dark:text-gray-100">
                Order total
              </dt>
              <dd className="text-base font-medium text-gray-900 dark:text-gray-100">
                ${calculateTotal().toFixed(2)}
              </dd>
            </div>
          </dl>

          <div className="mt-6">
            <Button
              type="button"
              className="w-full"
              size="lg"
              isLoading={isCheckingOut}
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

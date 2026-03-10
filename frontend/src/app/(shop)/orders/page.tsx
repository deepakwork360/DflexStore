"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Loader } from "@/components/ui/Loader";
import {
  Package,
  Truck,
  Calendar,
  MapPin,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/orders");
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loader fullScreen />;

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold dark:text-white mb-2">
          No orders found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
          You haven't placed any orders yet. Start shopping to see your orders
          here.
        </p>
        <Button onClick={() => router.push("/products")}>
          Explore Products
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-24">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-3xl font-bold dark:text-white flex items-center gap-2">
          <Package className="w-8 h-8 text-indigo-600" />
          My Orders
        </h1>
        <div className="text-sm font-medium text-gray-500">
          Showing {orders.length} orders
        </div>
      </div>

      <div className="space-y-8">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-[#121212] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Order Header */}
            <div className="bg-gray-50 dark:bg-white/5 p-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-white/5">
              <div className="flex gap-8">
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
                    Order Placed
                  </div>
                  <div className="text-sm dark:text-gray-200">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
                    Total
                  </div>
                  <div className="text-sm font-bold dark:text-white">
                    ${order.totalAmount.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
                    Status
                  </div>
                  <div
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      order.status === "CONFIRMED"
                        ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                        : order.status === "PENDING"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 font-mono">
                Order #{order.id.split("-")[0].toUpperCase()}
              </div>
            </div>

            {/* Order Body */}
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Items */}
                <div className="flex-1 space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 shrink-0">
                        {item.variant.product.images?.[0] ? (
                          <img
                            src={item.variant.product.images[0].url}
                            alt={item.variant.product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium dark:text-white">
                          {item.variant.product.title}
                        </h4>
                        <div className="text-sm text-gray-500 mt-1">
                          {item.variant.size && `Size: ${item.variant.size}`}{" "}
                          {item.variant.color &&
                            `| Color: ${item.variant.color}`}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm font-semibold dark:text-white">
                            ${item.price.toFixed(2)} x {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/products/${item.variant.product.slug}`,
                              )
                            }
                          >
                            Buy it again
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Info */}
                <div className="lg:w-72 bg-gray-50 dark:bg-white/5 p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h5 className="text-sm font-bold dark:text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
                      <Truck className="w-4 h-4 text-indigo-600" />
                      Delivery Address
                    </h5>
                    <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      <p className="font-bold dark:text-white mb-1">
                        {order.address.fullName}
                      </p>
                      <p>{order.address.address1}</p>
                      <p>
                        {order.address.city}, {order.address.state}{" "}
                        {order.address.postalCode}
                      </p>
                      <p>{order.address.country}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/5">
                    <Button className="w-full group" variant="ghost" size="sm">
                      Track Package
                      <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

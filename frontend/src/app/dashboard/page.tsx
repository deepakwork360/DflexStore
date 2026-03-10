"use client";

import React from "react";
import { useAuthStore } from "@/store/authStore";
import { Package, User as UserIcon, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  return (
    <div className="bg-gray-50 dark:bg-[#0a0a0a] min-h-screen pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="p-8 sm:p-10 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-md">
              <span className="text-4xl font-bold text-blue-600 dark:text-blue-400 uppercase">
                {user.name.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user.name}
              </h1>
              <p className="mt-2 text-gray-500 dark:text-gray-400 flex items-center justify-center sm:justify-start gap-2">
                <UserIcon className="w-4 h-4" /> {user.email}
              </p>
              <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-3">
                <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-900/20 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">
                  Active Account
                </span>
                <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-white/10 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-500/20">
                  Role: {user.role}
                </span>
              </div>
            </div>

            <div className="sm:ml-auto flex gap-3">
              <Button
                onClick={() => logout()}
                variant="secondary"
                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Stats / Nav */}
          <div className="flex flex-col gap-4">
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Orders
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    View your purchase history
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-not-allowed opacity-70">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg text-gray-600 dark:text-gray-400">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Settings
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Manage your preferences
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden h-full">
              <div className="border-b border-gray-200 dark:border-white/10 px-6 py-5">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Recent Orders
                </h2>
              </div>
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-400">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  No orders yet
                </h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400 max-w-sm">
                  When you place an order, it will appear here. Start shopping
                  to fill your history!
                </p>
                <Button
                  className="mt-6"
                  variant="primary"
                  onClick={() => (window.location.href = "/products")}
                >
                  Explore Products
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

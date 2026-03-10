"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { ShoppingBag, User, Menu, X, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);

  const cartItemsCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-gray-200 shadow-sm dark:bg-gray-900/80 dark:border-gray-800"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span
                className={`text-xl font-bold tracking-tighter ${isScrolled || pathname !== "/" ? "text-gray-900 dark:text-white" : "text-white"}`}
              >
                DFlex<span className="text-blue-500">Store</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links (Center) */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                  pathname.startsWith(link.href)
                    ? "text-blue-500"
                    : isScrolled || pathname !== "/"
                      ? "text-gray-600 dark:text-gray-300"
                      : "text-gray-300 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-red-500 ${
                  pathname.startsWith("/admin")
                    ? "text-red-500"
                    : isScrolled || pathname !== "/"
                      ? "text-red-600/80 dark:text-red-400/80"
                      : "text-red-400 hover:text-red-300"
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                Admin
              </Link>
            )}
          </div>

          {/* Desktop Right Actions (Cart & Auth) */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/cart"
              className={`relative flex items-center transition-colors hover:text-blue-500 ${
                isScrolled || pathname !== "/"
                  ? "text-gray-600 dark:text-gray-300"
                  : "text-gray-300"
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                    isScrolled || pathname !== "/"
                      ? "text-gray-600 dark:text-gray-300"
                      : "text-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{user?.name.split(" ")[0]}</span>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logout()}
                  className={
                    isScrolled || pathname !== "/"
                      ? ""
                      : "text-white border-white/20 hover:bg-white/10"
                  }
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={
                      isScrolled || pathname !== "/"
                        ? ""
                        : "text-white hover:bg-white/10"
                    }
                  >
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md ${isScrolled || pathname !== "/" ? "text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800" : "text-gray-300 hover:text-white"}`}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"} bg-white dark:bg-gray-900 shadow-xl border-b border-gray-200 dark:border-gray-800`}
      >
        <div className="space-y-1 px-4 pb-3 pt-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                pathname.startsWith(link.href)
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              {link.name}
            </Link>
          ))}
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                pathname.startsWith("/admin")
                  ? "bg-red-50 text-red-600 dark:bg-red-900/50 dark:text-red-400"
                  : "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              }`}
            >
              Admin Panel
            </Link>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pb-4 pt-4">
          <div className="flex items-center px-4 mb-4">
            <Link
              href="/cart"
              className="relative flex items-center p-2 rounded-full border border-gray-200 dark:border-gray-700"
            >
              <ShoppingBag className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-200">
              Your Cart
            </span>
          </div>

          {isAuthenticated ? (
            <div className="px-4 space-y-3">
              <div className="flex items-center px-3">
                <div className="shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold uppercase">
                    {user?.name.charAt(0)}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-white">
                    {user?.name}
                  </div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </div>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Dashboard
              </Link>
              <button
                onClick={() => logout()}
                className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="px-4 flex gap-3">
              <Link href="/login" className="flex-1">
                <Button variant="secondary" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button variant="primary" className="w-full">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/features/auth/api";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    try {
      // Create a clean payload to avoid sending empty strings for optional fields like phone
      const payload = { ...formData };
      if (!payload.phone?.trim()) {
        delete (payload as any).phone;
      }

      const response = await authApi.register(payload);
      if (response.success) {
        login(response.data.user, response.data.token);
        toast.success("Account created successfully!");
        router.push("/dashboard");
      }
    } catch (err: any) {
      const responseData = err.response?.data;
      const errorMessage =
        err.customMessage ||
        responseData?.message ||
        "Registration failed. Please try again.";

      setError(errorMessage);

      if (responseData?.errors) {
        setFieldErrors(responseData.errors);
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create an account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-200">
              {error}
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <Input
              label="Full Name*"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              error={fieldErrors.name}
            />
            <Input
              label="Email address*"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              error={fieldErrors.email}
            />
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1234567890"
              error={fieldErrors.phone}
            />
            <Input
              label="Password*"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={fieldErrors.password}
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              Sign up
            </Button>
          </div>
        </form>

        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

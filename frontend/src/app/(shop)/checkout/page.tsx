"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { Loader } from "@/components/ui/Loader";
import { Button } from "@/components/ui/Button";
import {
  ShoppingBag,
  ChevronRight,
  CreditCard,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

type Step = "address" | "payment" | "success";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState<Step>("address");
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + shipping;

  useEffect(() => {
    if (items.length === 0 && currentStep !== "success") {
      router.push("/cart");
    }
  }, [items, currentStep, router]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axiosInstance.get("/addresses");
        if (res.data.success) {
          setAddresses(res.data.data);
          const defaultAddr = res.data.data.find((a: any) => a.isDefault);
          if (defaultAddr) setSelectedAddressId(defaultAddr.id);
          else if (res.data.data.length > 0)
            setSelectedAddressId(res.data.data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch addresses");
      }
    };
    fetchAddresses();
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a shipping address");
      return;
    }

    setLoading(true);
    try {
      // 1. Create Payment session with addressId
      const paymentRes = await axiosInstance.post(
        "/payments/create-checkout-session",
        {
          addressId: selectedAddressId,
        },
      );

      if (paymentRes.data.data.url) {
        // Redirect to Stripe
        window.location.href = paymentRes.data.data.url;
        return;
      }

      setCurrentStep("success");
      clearCart();
      toast.success("Order placed successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && currentStep !== "success")
    return <Loader fullScreen />;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Column: Checkout Steps */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center space-x-4 mb-8">
            <h1 className="text-3xl font-bold dark:text-white">Checkout</h1>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2">
              <span
                className={
                  currentStep === "address" ? "text-indigo-600 font-medium" : ""
                }
              >
                Shipping
              </span>
              <ChevronRight className="w-4 h-4" />
              <span
                className={
                  currentStep === "payment" ? "text-indigo-600 font-medium" : ""
                }
              >
                Payment
              </span>
              <ChevronRight className="w-4 h-4" />
              <span
                className={
                  currentStep === "success" ? "text-indigo-600 font-medium" : ""
                }
              >
                Confirmation
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {currentStep === "address" && (
              <motion.div
                key="address"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-[#121212] p-8 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold dark:text-white flex items-center">
                      <Truck className="w-5 h-5 mr-2 text-indigo-600" />
                      Shipping Address
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAddingAddress(!isAddingAddress)}
                    >
                      {isAddingAddress ? "Cancel" : "Add New Address"}
                    </Button>
                  </div>

                  {isAddingAddress ? (
                    <AddressForm
                      onSuccess={(newAddr) => {
                        setAddresses([newAddr, ...addresses]);
                        setSelectedAddressId(newAddr.id);
                        setIsAddingAddress(false);
                      }}
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedAddressId === addr.id
                              ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10"
                              : "border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10"
                          }`}
                        >
                          <div className="flex justify-between">
                            <span className="font-medium dark:text-white">
                              {addr.fullName}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            {addr.address1}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {addr.city}, {addr.state} {addr.postalCode}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {addresses.length === 0 && !isAddingAddress && (
                    <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-xl">
                      No addresses saved. Please add one.
                    </div>
                  )}

                  <div className="mt-8">
                    <Button
                      className="w-full md:w-auto px-8"
                      disabled={!selectedAddressId}
                      onClick={() => setCurrentStep("payment")}
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === "payment" && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-[#121212] p-8 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
                  <h2 className="text-xl font-semibold dark:text-white flex items-center mb-6">
                    <CreditCard className="w-5 h-5 mr-2 text-indigo-600" />
                    Payment Method
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-8">
                    You will be redirected to Stripe's secure checkout to
                    complete your payment.
                  </p>

                  <div className="flex gap-4">
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentStep("address")}
                    >
                      Back to Shipping
                    </Button>
                    <Button
                      isLoading={loading}
                      onClick={handlePlaceOrder}
                      className="flex-1 bg-gray-900 dark:bg-white dark:text-black hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors"
                    >
                      Pay ${total.toFixed(2)}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-white dark:bg-[#121212] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm"
              >
                <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-bold dark:text-white mb-4">
                  Order Confirmed!
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  Thank you for your purchase. We've sent a confirmation email
                  to your inbox.
                </p>
                <Button onClick={() => router.push("/orders")}>
                  View My Orders
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Order Summary */}
        {currentStep !== "success" && (
          <div className="lg:w-96">
            <div className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm sticky top-24">
              <h2 className="text-xl font-semibold dark:text-white mb-6 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2 text-indigo-600" />
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                          No Img
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium dark:text-white truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-semibold dark:text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-100 dark:border-white/5">
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold dark:text-white pt-3 border-t border-gray-100 dark:border-white/5">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AddressForm({ onSuccess }: { onSuccess: (addr: any) => void }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    isDefault: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post("/addresses", formData);
      if (res.data.success) {
        toast.success("Address added successfully");
        onSuccess(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div className="md:col-span-2">
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Full Name
        </label>
        <input
          required
          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20"
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Phone
        </label>
        <input
          required
          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Address Line 1
        </label>
        <input
          required
          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20"
          value={formData.address1}
          onChange={(e) =>
            setFormData({ ...formData, address1: e.target.value })
          }
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          City
        </label>
        <input
          required
          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          State
        </label>
        <input
          required
          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20"
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Postal Code
        </label>
        <input
          required
          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20"
          value={formData.postalCode}
          onChange={(e) =>
            setFormData({ ...formData, postalCode: e.target.value })
          }
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Country
        </label>
        <select
          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 h-[46px]"
          value={formData.country}
          onChange={(e) =>
            setFormData({ ...formData, country: e.target.value })
          }
        >
          <option value="US">United States</option>
          <option value="IN">India</option>
          <option value="UK">United Kingdom</option>
          <option value="CA">Canada</option>
        </select>
      </div>
      <div className="md:col-span-2 flex items-center">
        <input
          type="checkbox"
          id="isDefault"
          className="w-4 h-4 text-indigo-600 rounded bg-indigo-50 border-indigo-200"
          checked={formData.isDefault}
          onChange={(e) =>
            setFormData({ ...formData, isDefault: e.target.checked })
          }
        />
        <label htmlFor="isDefault" className="ml-2 text-sm text-gray-500">
          Set as default address
        </label>
      </div>
      <div className="md:col-span-2">
        <Button isLoading={loading} className="w-full">
          Save Address
        </Button>
      </div>
    </form>
  );
}

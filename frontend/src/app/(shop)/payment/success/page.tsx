"use client";

import { useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { Loader } from "@/components/ui/Loader";
import { CheckCircle2, Package, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();
  const sessionId = searchParams.get("session_id");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden text-white font-sans selection:bg-indigo-500/30 flex items-center justify-center">
      {/* Background Gradients & Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[150px]" />
        <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[60%] h-[20%] rounded-[100%] bg-blue-500/10 blur-[100px]" />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <main className="relative z-10 w-full max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for premium feel
          }}
          className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8 md:p-12 text-center"
        >
          {/* Animated Background Pulse for the card */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />

          {/* Success Icon with Glow */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="relative w-24 h-24 mx-auto mb-8"
          >
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl" />
            <div className="relative w-full h-full bg-white/10 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
              <CheckCircle2 className="w-12 h-12 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Payment{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-400">
                Successful!
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-md mx-auto leading-relaxed">
              Experience the future of retail. Your order has been placed and is
              being processed by our team.
            </p>
          </motion.div>

          {/* Buttons Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="pt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => router.push("/orders")}
              size="lg"
              className="w-full sm:w-auto bg-indigo-500 text-white hover:bg-indigo-400 rounded-full h-14 px-8 text-base shadow-[0_0_20px_rgba(99,102,241,0.2)]"
            >
              <Package className="mr-2 h-5 w-5" />
              View Orders
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/products")}
              size="lg"
              className="w-full sm:w-auto rounded-full h-14 px-8 text-base border border-white/10 hover:bg-white/5 backdrop-blur-md text-white group"
            >
              Continue Shopping
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>

          {/* Social Proof / Trust Badge */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-12 text-xs text-gray-500 uppercase tracking-[0.2em]"
          >
            Secured and Encrypted Checkout
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <SuccessContent />
    </Suspense>
  );
}

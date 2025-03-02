"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 bg-neutral">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="max-w-md w-full bg-glass/30 backdrop-blur-sm border border-glass-border rounded-2xl p-6 shadow-xl"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-5"
        >
          <div className="relative w-full max-w-xs mx-auto mb-4">
            <Image
              src="/images/404.jpg"
              alt="404 Illustration"
              width={320}
              height={240}
              priority
              className="mx-auto rounded-lg shadow-md"
            />
          </div>

          <div className="space-y-1 text-center">
            <motion.h1
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="text-6xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 text-transparent bg-clip-text"
            >
              404
            </motion.h1>
            <h2 className="text-xl font-semibold text-foreground">
              Page not found
            </h2>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-4"
        >
          <p className="text-muted-foreground max-w-sm mx-auto text-center text-sm">
            The page you're looking for doesn't exist or has been moved. Let's
            get you back to building your digital presence.
          </p>

          <div className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-glass-border">
            <p className="text-xs font-medium mb-3 text-center">
              What would you like to do?
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="w-full sm:w-auto flex items-center justify-center gap-2 hover:bg-background/80 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>

              <Button
                onClick={() => router.push("/")}
                className="w-full sm:w-auto bg-gradient-to-r from-chart-1 to-chart-2 text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" />
                Return Home
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-center text-xs text-muted-foreground mt-3"
          >
            <p>
              Looking for something specific? Visit our{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-xs text-primary"
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </Button>{" "}
              or{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-xs text-primary"
                onClick={() => router.push("/features")}
              >
                Features
              </Button>{" "}
              page.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

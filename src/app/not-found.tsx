'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 bg-neutral">
      <div className="max-w-md w-full text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative h-24 w-24 mx-auto mb-6">
            <Image
              src="/logo.svg"
              alt="Vizify Logo"
              fill
              className="dark:invert"
            />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-7xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 text-transparent bg-clip-text">404</h1>
            <h2 className="text-2xl font-semibold text-foreground">Page not found</h2>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-6"
        >
          <p className="text-muted-foreground max-w-sm mx-auto">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back to building your digital presence.
          </p>
          
          <div className="p-6 rounded-lg bg-glass border border-glass-border backdrop-blur-sm">
            <p className="text-sm font-medium mb-4">What would you like to do?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => router.back()}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Go Back
              </Button>
              
              <Button
                onClick={() => router.push('/')}
                className="w-full sm:w-auto bg-gradient-to-r from-chart-1 to-chart-2 hover:opacity-90 transition-opacity"
              >
                Return Home
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

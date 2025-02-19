"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 md:px-12 pt-24 sm:pt-32">
      
     
      <motion.div 
        initial={{ opacity: 0, x: -50 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 0.6 }}
        className="max-w-lg text-center md:text-left"
      >
        <h1 className="text-4xl md:text-6xl font-bold leading-tight text-foreground">
          Your Digital Identity, <span className="text-primary">Simplified</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Create, share, and manage your digital business cards effortlessly.
        </p>
        <div className="mt-8 sm:mt-12 mb-8">
          <Button 
            size="lg" 
            className="relative px-8 py-4 text-lg font-semibold 
                      bg-gradient-to-r from-primary to-accent text-white 
                      shadow-lg rounded-lg transition-all duration-300 
                      hover:scale-105 hover:shadow-[0_0_25px_rgba(249,115,22,0.6)]
                      after:absolute after:inset-0 after:rounded-lg after:blur-lg 
                      after:bg-gradient-to-r after:from-primary after:to-accent after:opacity-50 after:-z-10"
          >
            Get Started
          </Button>
        </div>
      </motion.div>

     
      <motion.div 
          initial={{ opacity: 0, x: 50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6 }}
          className="sm:block md:flex justify-center relative pt-8 sm:pt-12"
        >
          <Image 
            src="/Vizify.png" 
            alt="Hero Image" 
            width={850} 
            height={650} 
            className="drop-shadow-2xl rounded-lg object-contain backdrop-blur-md opacity-90"
          />
      </motion.div>

    </section>
  );
}

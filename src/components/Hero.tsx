"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const titleVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }, 
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 md:px-12 py-24">
      
      <motion.div 
        initial="hidden"
        animate="visible"
        className="max-w-lg text-center md:text-left"
      >
        <motion.h1 
          variants={titleVariants} 
          className="text-4xl md:text-6xl font-bold leading-tight text-foreground"
        >
          {"Your Digital Identity,".split("").map((char, index) => (
            <motion.span key={index} variants={letterVariants}>
              {char}
            </motion.span>
          ))}
          <br />
          <span className="text-primary">
            {"Simplified".split("").map((char, index) => (
              <motion.span key={index} variants={letterVariants}>
                {char}
              </motion.span>
            ))}
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-4 text-lg text-muted-foreground"
        >
          Create, share, and manage your digital business cards effortlessly.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-12"
        >
        <Link href="/create">
        <Button 
            size="lg" 
            className="relative px-8 py-4 text-lg font-semibold 
                      bg-gradient-to-r from-primary to-sky-500 text-white 
                      shadow-lg rounded-lg transition-all duration-300 
                      hover:scale-105 hover:shadow-[0_0_25px_rgba(56,189,248,0.6)]
                      after:absolute after:inset-0 after:rounded-lg after:blur-lg border border-[rgba(255,255,255,0.2)]
                      after:bg-gradient-to-r after:from-primary after:to-sky-500 after:opacity-50 after:-z-10"
          >
            Get Started
          </Button>
        </Link>
        </motion.div>
      </motion.div>

      <motion.div 
          initial={{ opacity: 0, x: 50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6, delay: 0.4 }}
          className="sm:block md:flex justify-center relative pt-12 sm:pt-16"
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

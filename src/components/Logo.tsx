"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{
          scale: 1.1,
          filter: "drop-shadow(0px 0px 8px rgba(59, 130, 246, 0.8))",
        }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
      >
        <Image
          src="/logo.png"
          alt="Vizit Logo"
          width={40}
          height={40}
          className="trasnsition-all duration-300"
        />
      </motion.div>
      <span className="hidden md:inline text-xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 text-transparent bg-clip-text transition-transform duration-200 hover:scale-105">
        Vizify
      </span>
    </Link>
  );
}

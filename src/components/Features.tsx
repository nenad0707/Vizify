"use client";

import { motion } from "framer-motion";
import { Bolt, QrCode, Download, UserCheck } from "lucide-react";

const features = [
  {
    icon: <Bolt className="h-10 w-10 text-primary" />,
    title: "Instant Sharing",
    description: "Easily share your business card with anyone using QR codes.",
  },
  {
    icon: <QrCode className="h-10 w-10 text-primary" />,
    title: "QR Code Generator",
    description: "Generate a personalized QR code for your digital card.",
  },
  {
    icon: <Download className="h-10 w-10 text-primary" />,
    title: "Download as PNG",
    description: "Save your business card as an image for offline use.",
  },
  {
    icon: <UserCheck className="h-10 w-10 text-primary" />,
    title: "Secure & Private",
    description: "Your data is encrypted and securely stored.",
  },
];

export default function Features() {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-12 py-24">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-3xl md:text-5xl font-bold text-center text-foreground"
      >
        Key Features
      </motion.h2>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="p-6 border border-border rounded-lg shadow-md text-center group transition-all duration-300 
                      hover:bg-primary/10 dark:hover:bg-white/10 hover:shadow-lg"
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-foreground">
              {feature.title}
            </h3>
            <p className="mt-2 text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

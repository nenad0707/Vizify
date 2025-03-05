"use client";

import { motion } from "framer-motion";
import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface BusinessCardData {
  name: string;
  title: string;
  color: string;
  template: string;
  email?: string;
  phone?: string;
  company?: string;
}

interface LivePreviewProps {
  data: BusinessCardData;
  className?: string;
  interactive?: boolean;
}

// Function to get border radius based on template
const getBorderRadius = (template: string): string => {
  switch (template) {
    case "modern":
      return "0.75rem";
    case "minimalist":
      return "0.5rem";
    case "classic":
      return "0.25rem";
    default:
      return "0.75rem"; // Default to modern
  }
};

// Function to get text colors based on template
const getTextColors = (template: string) => {
  return {
    primary: template === "modern" ? "#ffffff" : "#000000",
    secondary:
      template === "modern" ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.7)",
    tertiary:
      template === "modern" ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.6)",
  };
};

// Function to get box shadow based on template
const getBoxShadow = (template: string): string => {
  switch (template) {
    case "modern":
      return "0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)";
    case "minimalist":
      return "0 1px 3px rgba(0,0,0,0.05)";
    case "classic":
      return "0 4px 6px rgba(0,0,0,0.1)";
    default:
      return "0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)";
  }
};

export const LivePreview = forwardRef<HTMLDivElement, LivePreviewProps>(
  ({ data, className, interactive = true }, ref) => {
    const { name, title, email, phone, company, color, template } = data;
    const borderRadius = getBorderRadius(template || "modern");
    const textColors = getTextColors(template || "modern");
    const boxShadow = getBoxShadow(template || "modern");

    return (
      <motion.div
        ref={ref}
        className={cn(
          "business-card w-full aspect-[1.7/1] overflow-hidden relative",
          interactive && "premium-3d-card",
          className,
        )}
        whileHover={
          interactive
            ? {
                rotateX: [0, -5, 0],
                rotateY: [0, 10, 0],
                transition: { duration: 0.5 },
              }
            : undefined
        }
        style={{
          backgroundColor: color,
          borderRadius,
          boxShadow,
        }}
      >
        {interactive && (
          <>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
          </>
        )}

        <div className="p-6 flex flex-col justify-between h-full relative">
          <div className="flex justify-between items-start">
            <div>
              <h3
                className="text-xl font-bold drop-shadow-sm"
                style={{ color: textColors.primary }}
              >
                {name || "Your Name"}
              </h3>
              <p
                className="text-sm mt-1"
                style={{ color: textColors.secondary }}
              >
                {title || "Your Title"}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm text-white font-bold text-lg shadow-md">
              {(name || "?").charAt(0)}
            </div>
          </div>

          <div>
            {company && (
              <p
                className="text-xs mb-1"
                style={{ color: textColors.tertiary }}
              >
                {company}
              </p>
            )}
            {email && (
              <p
                className="text-xs font-medium"
                style={{ color: textColors.secondary }}
              >
                {email}
              </p>
            )}
            {phone && (
              <p
                className="text-xs font-medium"
                style={{ color: textColors.secondary }}
              >
                {phone}
              </p>
            )}
          </div>

          <div className="absolute bottom-4 right-4 space-x-1 flex">
            <div className="h-1.5 w-8 bg-white/20 rounded-full" />
            <div className="h-1.5 w-5 bg-white/20 rounded-full" />
            <div className="h-1.5 w-3 bg-white/20 rounded-full" />
          </div>
        </div>
      </motion.div>
    );
  },
);

LivePreview.displayName = "LivePreview";

export default LivePreview;

"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface BusinessCardData {
  name?: string;
  title?: string;
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
  switch (template) {
    case "modern":
      return {
        primary: "#ffffff",
        secondary: "rgba(255,255,255,0.9)",
        tertiary: "rgba(255,255,255,0.7)",
        accent: "rgba(255,255,255,0.3)",
      };
    case "minimalist":
      return {
        primary: "#000000",
        secondary: "rgba(0,0,0,0.7)",
        tertiary: "rgba(0,0,0,0.5)",
        accent: "rgba(0,0,0,0.05)",
      };
    case "classic":
      return {
        primary: "#1a1a1a",
        secondary: "rgba(0,0,0,0.8)",
        tertiary: "rgba(0,0,0,0.6)",
        accent: "rgba(0,0,0,0.1)",
      };
    default:
      return {
        primary: "#ffffff",
        secondary: "rgba(255,255,255,0.9)",
        tertiary: "rgba(255,255,255,0.8)",
        accent: "rgba(255,255,255,0.2)",
      };
  }
};

// Function to get box shadow based on template
const getBoxShadow = (template: string): string => {
  switch (template) {
    case "modern":
      return "0 20px 25px -5px rgba(0,0,0,0.15), 0 10px 10px -5px rgba(0,0,0,0.08), inset 0 1px 0 0 rgba(255,255,255,0.1)";
    case "minimalist":
      return "0 1px 2px rgba(0,0,0,0.03)";
    case "classic":
      return "0 4px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)";
    default:
      return "0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)";
  }
};

// Function to get overlay gradient
const getOverlayGradient = (template: string): string => {
  switch (template) {
    case "modern":
      return "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 80%)";
    case "classic":
      return "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.02) 100%)";
    case "minimalist":
      return "none";
    default:
      return "none";
  }
};

// Function to get specific layout for template
const getLayout = (template: string): string => {
  switch (template) {
    case "modern":
      return "flex flex-col justify-between";
    case "classic":
      return "flex flex-col justify-between";
    case "minimalist":
      return "flex flex-col items-start justify-center";
    default:
      return "flex flex-col justify-between";
  }
};

// Helper function to darken or lighten a color
function adjustColor(color: string, amount: number): string {
  // Remove # if present
  color = color.replace(/^#/, "");

  // Parse the color
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);

  // Adjust the color
  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));

  // Convert back to hex
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

const LivePreview = forwardRef<HTMLDivElement, LivePreviewProps>(
  ({ data, className, interactive = true }, ref) => {
    const { name, title, email, phone, company, color, template } = data;
    const templateType = template || "modern";
    const borderRadius = getBorderRadius(templateType);
    const textColors = getTextColors(templateType);
    const boxShadow = getBoxShadow(templateType);
    const layout = getLayout(templateType);
    const overlayGradient = getOverlayGradient(templateType);

    // Calculate lighter or darker accent color based on template
    const accentColor =
      templateType === "minimalist"
        ? adjustColor(color, 40) // Lighter for minimalist
        : adjustColor(color, -40); // Darker for others

    return (
      <motion.div
        ref={ref}
        className={cn(
          "business-card w-full aspect-[1.7/1] overflow-hidden relative",
          interactive && "premium-3d-card",
          className,
        )}
        whileHover={
          interactive && templateType === "minimalist"
            ? {
                y: -3,
                transition: { duration: 0.2 },
              }
            : interactive
            ? {
                rotateX: [0, -5, 0],
                rotateY: [0, 10, 0],
                scale: 1.02,
                transition: { duration: 0.5 },
              }
            : undefined
        }
        style={{
          backgroundColor: color,
          borderRadius,
          boxShadow,
          border:
            templateType === "classic"
              ? `1px solid ${adjustColor(color, -20)}`
              : "none",
        }}
      >
        {/* Template-specific overlays */}
        {templateType === "modern" && (
          <div
            className="absolute inset-0 z-10"
            style={{
              background: overlayGradient,
              borderRadius,
            }}
          />
        )}

        {interactive && (
          <>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
          </>
        )}

        {/* Template-specific elements */}
        {templateType === "classic" && (
          <div
            className="absolute top-0 left-0 right-0 h-2"
            style={{
              backgroundColor: adjustColor(color, -30),
              borderTopLeftRadius: borderRadius,
              borderTopRightRadius: borderRadius,
            }}
          />
        )}

        {templateType === "minimalist" && (
          <div
            className="absolute left-0 top-0 bottom-0 w-1"
            style={{
              backgroundColor: accentColor,
            }}
          />
        )}

        <div className={cn("p-6 h-full relative", layout)}>
          {templateType === "minimalist" ? (
            <>
              <div className="mb-auto">
                <h3
                  className="text-xl font-bold"
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

              <div className="mt-auto">
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
            </>
          ) : (
            // Original layout for other templates
            <>
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
            </>
          )}

          {templateType === "classic" && (
            <div
              className="absolute top-6 right-6 h-16 w-16 opacity-5 rounded-full"
              style={{
                border: `3px solid ${textColors.primary}`,
              }}
            />
          )}

          {templateType === "modern" && (
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent z-0" />
          )}
        </div>
      </motion.div>
    );
  },
);

LivePreview.displayName = "LivePreview";

export default LivePreview;

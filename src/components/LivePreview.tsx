"use client";

import { motion } from "framer-motion";
import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Mail, Phone, Building2 } from "lucide-react";

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
      return "0.4rem"; 
    case "classic":
      return "0.2rem";
    default:
      return "0.75rem";
  }
};

// Function to get text colors based on template and background color
const getTextColors = (template: string, bgColor: string) => {
  // Check if the background color is light or dark
  const isLight = (color: string) => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  };

  const lightBg = isLight(bgColor);

  if (template === "modern") {
    // Modern template always uses white text regardless of background
    return {
      primary: "#ffffff",
      secondary: "rgba(255,255,255,0.9)",
      tertiary: "rgba(255,255,255,0.7)",
      accent: "rgba(255,255,255,0.3)",
    };
  } else if (lightBg) {
    // Light background → dark text
    return {
      primary: "#1a1a1a",
      secondary: "rgba(0,0,0,0.8)",
      tertiary: "rgba(0,0,0,0.6)",
      accent: "rgba(0,0,0,0.1)",
    };
  } else {
    // Dark background → light text
    return {
      primary: "#ffffff",
      secondary: "rgba(255,255,255,0.9)",
      tertiary: "rgba(255,255,255,0.7)",
      accent: "rgba(255,255,255,0.2)",
    };
  }
};

// Function to get box shadow based on template
const getBoxShadow = (template: string): string => {
  switch (template) {
    case "modern":
      return "0 20px 25px -5px rgba(0,0,0,0.15), 0 10px 10px -5px rgba(0,0,0,0.08)";
    case "minimalist":
      return "0 1px 3px rgba(0,0,0,0.05)";
    case "classic":
      return "0 4px 6px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)";
    default:
      return "0 10px 25px -5px rgba(0,0,0,0.1)";
  }
};

// Helper function to darken or lighten a color
function adjustColor(color: string, amount: number): string {
  color = color.replace(/^#/, "");
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);
  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export const LivePreview = forwardRef<HTMLDivElement, LivePreviewProps>(
  ({ data, className, interactive = true }, ref) => {
    const { name, title, email, phone, company, color, template } = data;
    const templateType = template || "modern";
    const borderRadius = getBorderRadius(templateType);
    const textColors = getTextColors(templateType, color);
    const boxShadow = getBoxShadow(templateType);
    
    // Track mouse position for 3D effect
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    
    // Calculate accent color
    const accentColor = templateType === "minimalist" 
      ? adjustColor(color, 40) 
      : adjustColor(color, -30);
    
    // Handle mouse move for 3D rotation
    const handleMouseMove = (e: React.MouseEvent) => {
      if (!interactive) return;
      
      const rect = e.currentTarget.getBoundingClientRect();
      // Calculate normalized coordinates (-0.5 to 0.5)
      const x = ((e.clientX - rect.left) / rect.width) - 0.5;
      const y = ((e.clientY - rect.top) / rect.height) - 0.5;
      
      setMousePosition({ x, y });
    };
    
    // Handle mouse leave
    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 });
    };

    // Get rotation strength based on template
    const getRotationStrength = () => {
      switch (templateType) {
        case "modern":
          return 10; // More pronounced rotation
        case "minimalist":
          return 5;  // Subtle rotation
        case "classic":
          return 3;  // Very subtle rotation
        default:
          return 7;
      }
    };

    const rotationStrength = getRotationStrength();

    return (
      <div 
        ref={ref}
        className={cn(
          "relative w-full max-w-[400px] mx-auto aspect-[1.7/1]",
          className
        )}
      >
        <motion.div
          className="business-card w-full h-full rounded-lg overflow-hidden relative"
          style={{
            backgroundColor: color,
            borderRadius,
            boxShadow,
            border:
              templateType === "classic"
                ? `1px solid ${adjustColor(color, -20)}`
                : templateType === "minimalist" 
                ? `1px solid ${adjustColor(color, 20)}`
                : "none",
            transform: interactive 
              ? `perspective(1000px) rotateY(${mousePosition.x * rotationStrength}deg) rotateX(${-mousePosition.y * rotationStrength}deg)`
              : undefined,
            transition: "transform 0.3s ease"
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={interactive ? { scale: 1.02 } : undefined}
        >
          {/* MODERN TEMPLATE */}
          {templateType === "modern" && (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
              <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
            </>
          )}

          {/* CLASSIC TEMPLATE */}
          {templateType === "classic" && (
            <>
              <div
                className="absolute top-0 left-0 right-0 h-2"
                style={{
                  backgroundColor: adjustColor(color, -30),
                  borderTopLeftRadius: borderRadius,
                  borderTopRightRadius: borderRadius,
                }}
              />
              
              <div className="absolute right-4 top-4 h-16 w-16 rounded-full opacity-10"
                style={{ border: `1px solid ${textColors.primary}` }} 
              />
            </>
          )}

          {/* MINIMALIST TEMPLATE */}
          {templateType === "minimalist" && (
            <div
              className="absolute left-0 top-0 bottom-0 w-1.5"
              style={{
                backgroundColor: accentColor,
              }}
            />
          )}

          {/* CARD CONTENT */}
          <div className={cn("p-6 h-full relative", 
            templateType === "minimalist" 
              ? "flex flex-col items-start justify-center pl-8" 
              : "flex flex-col justify-between"
          )}>
            {templateType === "minimalist" ? (
              // MINIMALIST LAYOUT
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

                <div className="mt-auto space-y-2">
                  {company && (
                    <div className="flex items-center gap-2">
                      <Building2 
                        size={12} 
                        style={{ color: textColors.tertiary }}
                      />
                      <p
                        className="text-xs"
                        style={{ color: textColors.tertiary }}
                      >
                        {company}
                      </p>
                    </div>
                  )}
                  {email && (
                    <div className="flex items-center gap-2">
                      <Mail 
                        size={12} 
                        style={{ color: textColors.tertiary }}
                      />
                      <p
                        className="text-xs"
                        style={{ color: textColors.tertiary }}
                      >
                        {email}
                      </p>
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-center gap-2">
                      <Phone 
                        size={12} 
                        style={{ color: textColors.tertiary }}
                      />
                      <p
                        className="text-xs"
                        style={{ color: textColors.tertiary }}
                      >
                        {phone}
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : templateType === "classic" ? (
              // CLASSIC LAYOUT
              <>
                <div>
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
                  
                  {company && (
                    <p
                      className="text-xs mt-2"
                      style={{ color: textColors.tertiary }}
                    >
                      {company}
                    </p>
                  )}
                </div>

                <div className="space-y-1 mt-3">
                  {email && (
                    <div className="flex items-center gap-1.5">
                      <Mail 
                        size={12} 
                        style={{ color: textColors.tertiary }}  
                      />
                      <p
                        className="text-xs"
                        style={{ color: textColors.tertiary }}
                      >
                        {email}
                      </p>
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone 
                        size={12} 
                        style={{ color: textColors.tertiary }}
                      />
                      <p
                        className="text-xs"
                        style={{ color: textColors.tertiary }}
                      >
                        {phone}
                      </p>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-5 right-5">
                  <div 
                    className="text-xs font-semibold" 
                    style={{ color: textColors.primary }}
                  >
                    {name?.split(' ')[0]?.toUpperCase() || 'VIZIFY'}
                  </div>
                </div>
              </>
            ) : (
              // MODERN LAYOUT
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h3
                      className="text-xl font-bold"
                      style={{ color: textColors.primary }}
                    >
                      {name || "Your Name"}
                    </h3>
                    <p
                      className="text-sm mt-0.5"
                      style={{ color: textColors.secondary }}
                    >
                      {title || "Your Title"}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full flex items-center justify-center bg-white/20 text-white font-bold text-lg">
                    {(name || "?").charAt(0)}
                  </div>
                </div>

                <div className="space-y-1.5 relative z-10">
                  {company && (
                    <div className="flex items-center gap-1.5">
                      <Building2 
                        size={14} 
                        style={{ color: textColors.tertiary }}
                      />
                      <p
                        className="text-xs"
                        style={{ color: textColors.tertiary }}
                      >
                        {company}
                      </p>
                    </div>
                  )}
                  {email && (
                    <div className="flex items-center gap-1.5">
                      <Mail 
                        size={14} 
                        style={{ color: textColors.tertiary }}
                      />
                      <p
                        className="text-xs"
                        style={{ color: textColors.tertiary }}
                      >
                        {email}
                      </p>
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone 
                        size={14} 
                        style={{ color: textColors.tertiary }}
                      />
                      <p
                        className="text-xs"
                        style={{ color: textColors.tertiary }}
                      >
                        {phone}
                      </p>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-4 right-4 space-x-1 flex">
                  <div className="h-1.5 w-8 bg-white/20 rounded-full" />
                  <div className="h-1.5 w-5 bg-white/20 rounded-full" />
                  <div className="h-1.5 w-3 bg-white/20 rounded-full" />
                </div>
              </>
            )}
          </div>
        </motion.div>
        
        {/* Card shadow/reflection */}
        {interactive && (
          <div 
            className="absolute top-[100%] left-0 right-0 h-[20%] opacity-20 rounded-b-lg overflow-hidden" 
            style={{
              background: `linear-gradient(to bottom, ${adjustColor(color, -20)}, transparent)`,
              transformOrigin: 'top center',
              transform: 'scaleY(0.5)',
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)'
            }}
          />
        )}
      </div>
    );
  },
);

LivePreview.displayName = "LivePreview";

export default LivePreview;
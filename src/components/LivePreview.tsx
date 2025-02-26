"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface FormData {
  name: string;
  title: string;
  color: string;
  template?: "modern" | "classic" | "minimalist";
}

interface LivePreviewProps {
  formData: FormData;
}

export default function LivePreview({ formData }: LivePreviewProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  // Get card style based on template
  const getCardStyle = () => {
    switch (formData.template) {
      case "classic":
        return {
          border: "1px solid rgba(0,0,0,0.2)",
          borderRadius: "0.25rem",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)",
          fontFamily: "'Inter', sans-serif",
          nameColor: "black",
          titleColor: "rgba(0,0,0,0.7)",
          pattern:
            "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%)",
          padding: "1.5rem",
          logoStyle: {
            shape: "square",
            border: "1px solid rgba(0,0,0,0.1)",
            backgroundColor: "transparent",
          },
        };
      case "minimalist":
        return {
          border: "none",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          fontFamily: "'Inter', sans-serif",
          nameColor: "black",
          titleColor: "rgba(0,0,0,0.6)",
          pattern: "none",
          padding: "1.5rem",
          logoStyle: {
            shape: "circle",
            border: "none",
            backgroundColor: "rgba(0,0,0,0.03)",
          },
        };
      case "modern":
      default:
        return {
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "0.75rem",
          boxShadow:
            "0 10px 30px -5px rgba(0,0,0,0.3), 0 4px 6px -2px rgba(0,0,0,0.05)",
          fontFamily: "'Inter', sans-serif",
          nameColor: "white",
          titleColor: "rgba(255,255,255,0.9)",
          pattern:
            "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)",
          padding: "2rem",
          logoStyle: {
            shape: "circle",
            border: "1px solid rgba(255,255,255,0.3)",
            backgroundColor: "rgba(255,255,255,0.1)",
          },
        };
    }
  };

  const style = getCardStyle();

  // Calculate text color based on background color
  const getTextColor = (baseColor: string) => {
    // Convert hex to RGB
    const hex = baseColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return white for dark backgrounds, black for light backgrounds
    if (luminance < 0.6) {
      return {
        nameColor: "#ffffff",
        titleColor: "rgba(255, 255, 255, 0.85)",
      };
    } else {
      return {
        nameColor: "#000000",
        titleColor: "rgba(0, 0, 0, 0.75)",
      };
    }
  };

  // Use smart text color detection instead of template-defined color
  const textColors = getTextColor(formData.color);

  // Handle mouse movement for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    // Calculate rotation based on mouse position
    const x = (e.clientY - rect.top - rect.height / 2) / 10;
    const y = (rect.left + rect.width / 2 - e.clientX) / 10;

    setRotate({ x, y });
  };

  // Reset rotation when mouse leaves
  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-50/20 to-gray-100/20 dark:from-gray-900/20 dark:to-gray-800/20">
      <motion.div
        className="relative cursor-grab active:cursor-grabbing"
        style={{
          width: "320px",
          height: "200px",
          perspective: "1000px",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="w-full h-full"
          style={{
            backgroundColor: formData.color,
            borderRadius: style.borderRadius,
            border: style.border,
            boxShadow: style.boxShadow,
            padding: style.padding,
            backgroundImage: style.pattern,
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <div className="flex flex-col h-full justify-between">
            {/* Logo/Icon */}
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius:
                  style.logoStyle.shape === "circle" ? "50%" : "4px",
                border: style.logoStyle.border,
                backgroundColor: style.logoStyle.backgroundColor,
                transform: "translateZ(30px)",
                opacity: 0.9,
                position: "absolute",
                top: "10px",
                right: "10px",
              }}
            />

            {/* Name */}
            <div
              className="text-2xl font-bold"
              style={{
                color: textColors.nameColor,
                transform: "translateZ(20px)",
                textShadow: "0 1px 2px rgba(0,0,0,0.2)",
              }}
            >
              {formData.name || "Your Name"}
            </div>

            {/* Title */}
            <div
              className="text-lg"
              style={{
                color: textColors.titleColor,
                transform: "translateZ(10px)",
              }}
            >
              {formData.title || "Your Title"}
            </div>

            {/* Contact details (only visual, not functional) */}
            <div
              className="flex items-center gap-2 mt-auto"
              style={{
                color: textColors.titleColor,
                opacity: 0.7,
                fontSize: "0.7rem",
                transform: "translateZ(5px)",
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: textColors.titleColor }}
              ></div>
              <span>example@company.com</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-muted-foreground">
        Move your mouse over the card to rotate
      </div>
    </div>
  );
}

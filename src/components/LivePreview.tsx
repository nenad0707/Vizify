"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { CardFormData } from "@/components/CardCreator/CardCreatorContext";

interface LivePreviewProps {
  formData: CardFormData;
}

export default function LivePreview({ formData }: LivePreviewProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [cardShadow, setCardShadow] = useState("0px 5px 15px rgba(0,0,0,0.1)");

  // Handle mouse movement for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;

    // Calculate rotation based on mouse position relative to card center
    const rotateYVal = ((e.clientX - cardCenterX) / (rect.width / 2)) * 8;
    const rotateXVal = ((e.clientY - cardCenterY) / (rect.height / 2)) * -8;

    // Update rotation and shadow based on mouse position
    setRotateX(rotateXVal);
    setRotateY(rotateYVal);
    setCardShadow(
      `${rotateYVal * 0.2}px ${
        Math.abs(rotateXVal) * 0.5
      }px 20px rgba(0,0,0,0.1)`,
    );
  };

  // Reset card rotation when mouse leaves
  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setCardShadow("0px 5px 15px rgba(0,0,0,0.1)");
  };

  // Return to flat position smoothly when component unmounts
  useEffect(() => {
    return () => {
      setRotateX(0);
      setRotateY(0);
      setCardShadow("0px 5px 15px rgba(0,0,0,0.1)");
    };
  }, []);

  // Get the best text color based on background color
  const getTextColor = (bgColor: string, template: string) => {
    // Modern template uses white text regardless
    if (template === "modern") {
      return { primary: "#ffffff", secondary: "rgba(255,255,255,0.85)" };
    }

    // For other templates, check if background is dark
    const isLight = isLightColor(bgColor);
    return isLight
      ? { primary: "#111111", secondary: "rgba(0,0,0,0.7)" }
      : { primary: "#ffffff", secondary: "rgba(255,255,255,0.85)" };
  };

  // Helper to determine if a color is light or dark
  const isLightColor = (color: string) => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  };

  // Get text colors based on background and template
  const textColors = getTextColor(formData.color, formData.template);

  const fontFamily =
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

  return (
    <div className="w-full h-full flex justify-center items-center">
      <motion.div
        ref={cardRef}
        className="w-full h-[210px] max-w-[350px] rounded-lg relative cursor-pointer overflow-hidden"
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          backgroundColor: formData.color,
          borderRadius:
            formData.template === "modern"
              ? "0.75rem"
              : formData.template === "minimalist"
              ? "0.5rem"
              : "0.25rem",
          boxShadow: cardShadow,
          transformStyle: "preserve-3d",
          fontFamily,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {formData.template === "modern" && (
          <div
            className="absolute w-32 h-32 rounded-full opacity-10"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)",
              top: "-10px",
              right: "-10px",
              transform: "translateZ(2px)",
            }}
          />
        )}

        <div className="absolute inset-0 p-5 flex flex-col justify-between">
          {" "}
          <div style={{ transform: "translateZ(5px)" }}>
            <h3
              className="text-xl font-bold mb-1.5 tracking-tight"
              style={{
                color: textColors.primary,
                letterSpacing:
                  formData.template === "modern" ? "-0.02em" : "normal",
                textShadow:
                  formData.template === "modern"
                    ? "0 1px 2px rgba(0,0,0,0.1)"
                    : "none",
              }}
            >
              {formData.name}
            </h3>
            <p
              className="text-base opacity-90 font-medium"
              style={{ color: textColors.secondary }}
            >
              {formData.title}
            </p>
          </div>
          {/* Contact Info */}
          {formData.email && (
            <div
              className="flex items-center gap-2.5 opacity-90 backdrop-blur-sm rounded-full pr-2.5 py-1"
              style={{
                color: textColors.secondary,
                backgroundColor:
                  formData.template === "modern"
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
                width: "fit-content",
              }}
            >
              <Mail className="h-4 w-4" />
              <span className="text-sm font-medium">{formData.email}</span>{" "}
            </div>
          )}
          <div
            className="absolute inset-0 rounded-lg opacity-15"
            style={{
              background: `linear-gradient(
                ${315 + rotateY / 2}deg, 
                transparent 35%, 
                rgba(255, 255, 255, 0.3) 50%, 
                transparent 65%
              )`,
              pointerEvents: "none",
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-20 h-20 opacity-10"
            style={{
              background: `radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)`,
              pointerEvents: "none",
              transform: "translateZ(1px)",
            }}
          />
          {formData.template === "modern" && (
            <div
              className="absolute bottom-3 right-3 text-[8px] opacity-30 font-medium uppercase tracking-widest"
              style={{ color: textColors.primary }}
            >
              Vizify
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

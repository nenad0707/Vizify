"use client";

import { motion } from "framer-motion";
import { forwardRef, useState, useRef, useEffect } from "react";
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

// Simple helper function to determine if a color is light or dark
const isLightColor = (hexColor: string): boolean => {
  // Remove the # if present
  hexColor = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);
  
  // Calculate luminance (perceived brightness)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5;
};

// Helper function to adjust color
const adjustColor = (color: string, amount: number): string => {
  color = color.replace(/^#/, "");
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);
  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

export const LivePreview = forwardRef<HTMLDivElement, LivePreviewProps>(
  ({ data, className, interactive = true }, ref) => {
    const { name, title, email, phone, company, color, template } = data;
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const isLight = isLightColor(color);
    
    // Calculate theme-specific styles
    const getTemplateStyles = () => {
      switch (template) {
        case 'modern':
          return {
            borderRadius: '0.75rem',
            boxShadow: '0 10px 30px -12px rgba(0,0,0,0.25)',
            textColor: '#ffffff', // Modern template always uses white text
            accentColor: adjustColor(color, -40),
          };
        case 'classic':
          return {
            borderRadius: '0.25rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            textColor: isLight ? '#000000' : '#ffffff',
            accentColor: adjustColor(color, isLight ? -50 : 40),
          };
        case 'minimalist':
          return {
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            textColor: isLight ? '#000000' : '#ffffff',
            accentColor: adjustColor(color, isLight ? -30 : 30),
          };
        default:
          return {
            borderRadius: '0.75rem',
            boxShadow: '0 10px 30px -12px rgba(0,0,0,0.25)',
            textColor: '#ffffff',
            accentColor: adjustColor(color, -40),
          };
      }
    };
    
    const styles = getTemplateStyles();

    // Handle mouse movement for 3D effect
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive || !cardRef.current) return;
      
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      
      // Calculate cursor position relative to the card center, normalized to -1 to 1
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      
      // Set rotation values (inverted Y for natural feel)
      setRotation({
        x: -y * 10, // Multiply by strength factor
        y: x * 10,  // Multiply by strength factor
      });
    };
    
    // Reset rotation when mouse leaves
    const handleMouseLeave = () => {
      setRotation({ x: 0, y: 0 });
    };

    // Apply an initial animation effect
    useEffect(() => {
      if (interactive) {
        const timer = setTimeout(() => {
          setRotation({ x: 2, y: -2 });
          setTimeout(() => {
            setRotation({ x: 0, y: 0 });
          }, 500);
        }, 300);
        
        return () => clearTimeout(timer);
      }
    }, [interactive]);

    return (
      <div
        ref={ref}
        className={cn(
          "w-full max-w-md mx-auto aspect-[1.7/1]",
          className
        )}
      >
        <motion.div
          ref={cardRef}
          className="business-card w-full h-full relative overflow-hidden"
          style={{
            backgroundColor: color,
            borderRadius: styles.borderRadius,
            boxShadow: styles.boxShadow,
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
          animate={{
            rotateX: rotation.x,
            rotateY: rotation.y,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            mass: 0.8
          }}
          whileHover={interactive ? { scale: 1.02 } : undefined}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* TEMPLATE-SPECIFIC ELEMENTS */}

          {/* Modern template elements */}
          {template === 'modern' && (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-black/20 opacity-50" />
              <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-white/10 -translate-y-1/3 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
            </>
          )}

          {/* Classic template elements */}
          {template === 'classic' && (
            <>
              <div 
                className="absolute top-0 left-0 right-0 h-2"
                style={{ 
                  backgroundColor: styles.accentColor,
                  borderTopLeftRadius: styles.borderRadius,
                  borderTopRightRadius: styles.borderRadius
                }}
              />
            </>
          )}

          {/* Minimalist template elements */}
          {template === 'minimalist' && (
            <div 
              className="absolute left-0 top-0 bottom-0 w-1.5"
              style={{ backgroundColor: styles.accentColor }}
            />
          )}

          {/* CARD CONTENT */}
          <div className={cn(
            "p-6 h-full relative flex flex-col",
            template === 'minimalist' ? "pl-8 justify-center" : "justify-between"
          )}>
            {/* Modern template layout */}
            {template === 'modern' && (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 
                      className="text-xl font-bold" 
                      style={{ color: styles.textColor }}
                    >
                      {name || "Your Name"}
                    </h3>
                    <p 
                      className="text-sm mt-1 opacity-90" 
                      style={{ color: styles.textColor }}
                    >
                      {title || "Your Title"}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full flex items-center justify-center bg-white/20 text-white font-semibold text-lg">
                    {(name || "?").charAt(0)}
                  </div>
                </div>

                {/* Contact Information - ensuring it shows properly */}
                <div className="space-y-1.5 mt-auto relative z-10">
                  {company && (
                    <div className="flex items-center gap-2">
                      <Building2 
                        size={14} 
                        className="opacity-80"
                        style={{ color: styles.textColor }} 
                      />
                      <p 
                        className="text-xs opacity-80" 
                        style={{ color: styles.textColor }}
                      >
                        {company}
                      </p>
                    </div>
                  )}
                  {email && (
                    <div className="flex items-center gap-2">
                      <Mail 
                        size={14} 
                        className="opacity-80"
                        style={{ color: styles.textColor }} 
                      />
                      <p 
                        className="text-xs opacity-80"
                        style={{ color: styles.textColor }}
                      >
                        {email}
                      </p>
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-center gap-2">
                      <Phone 
                        size={14}
                        className="opacity-80"
                        style={{ color: styles.textColor }}
                      />
                      <p 
                        className="text-xs opacity-80"
                        style={{ color: styles.textColor }}
                      >
                        {phone}
                      </p>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-4 right-4 space-x-1 flex">
                  <div className="h-1.5 w-8 bg-white/25 rounded-full" />
                  <div className="h-1.5 w-5 bg-white/15 rounded-full" />
                  <div className="h-1.5 w-3 bg-white/10 rounded-full" />
                </div>
              </>
            )}

            {/* Classic template layout */}
            {template === 'classic' && (
              <>
                <div>
                  <h3
                    className="text-xl font-bold"
                    style={{ color: styles.textColor }}
                  >
                    {name || "Your Name"}
                  </h3>
                  <p
                    className="text-sm mt-1 opacity-90"
                    style={{ color: styles.textColor }}
                  >
                    {title || "Your Title"}
                  </p>
                  
                  {company && (
                    <p
                      className="text-xs mt-2 opacity-70"
                      style={{ color: styles.textColor }}
                    >
                      {company}
                    </p>
                  )}
                </div>

                {/* Ensure contact information is displayed */}
                <div className="space-y-1.5 mt-auto">
                  {email && (
                    <div className="flex items-center gap-2">
                      <Mail 
                        size={12}
                        className="opacity-70" 
                        style={{ color: styles.textColor }} 
                      />
                      <p
                        className="text-xs opacity-70"
                        style={{ color: styles.textColor }}
                      >
                        {email}
                      </p>
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-center gap-2">
                      <Phone 
                        size={12}
                        className="opacity-70"
                        style={{ color: styles.textColor }}
                      />
                      <p
                        className="text-xs opacity-70"
                        style={{ color: styles.textColor }}
                      >
                        {phone}
                      </p>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-4 right-4 opacity-90">
                  <div
                    className="text-xs font-semibold"
                    style={{ color: styles.textColor }}
                  >
                    {name?.split(' ')[0]?.toUpperCase() || 'VIZIFY'}
                  </div>
                </div>
              </>
            )}

            {/* Minimalist template layout */}
            {template === 'minimalist' && (
              <>
                <div>
                  <h3
                    className="text-xl font-bold"
                    style={{ color: styles.textColor }}
                  >
                    {name || "Your Name"}
                  </h3>
                  <p
                    className="text-sm mt-1"
                    style={{ color: styles.textColor }}
                  >
                    {title || "Your Title"}
                  </p>
                </div>

                {/* Ensure contact information is displayed */}
                <div className="space-y-2 mt-4">
                  {company && (
                    <div className="flex items-center gap-2">
                      <Building2 
                        size={12}
                        className="opacity-80"
                        style={{ color: styles.textColor }}
                      />
                      <p
                        className="text-xs"
                        style={{ color: styles.textColor }}
                      >
                        {company}
                      </p>
                    </div>
                  )}
                  {email && (
                    <div className="flex items-center gap-2">
                      <Mail 
                        size={12}
                        className="opacity-80"
                        style={{ color: styles.textColor }}
                      />
                      <p
                        className="text-xs"
                        style={{ color: styles.textColor }}
                      >
                        {email}
                      </p>
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-center gap-2">
                      <Phone 
                        size={12}
                        className="opacity-80"
                        style={{ color: styles.textColor }}
                      />
                      <p
                        className="text-xs"
                        style={{ color: styles.textColor }}
                      >
                        {phone}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Card shadow effect */}
        {interactive && (
          <div 
            className="absolute mt-2 left-0 right-0 h-[16px] opacity-20 blur-sm"
            style={{
              background: `linear-gradient(to bottom, ${color}, transparent)`,
              borderRadius: '50%',
              width: '92%',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
        )}
      </div>
    );
  }
);

LivePreview.displayName = "LivePreview";

export default LivePreview;
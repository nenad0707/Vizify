"use client";

import { useCardCreator } from "./CardCreatorContext";
import { FormSectionWrapper } from "./shared/FormSectionWrapper";
import { Label } from "@/components/ui/label";
import { Palette, Check, Sparkles, EyeIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ColorPicker from "@/components/ColorPicker";
import Image from "next/image";
import LivePreview from "@/components/LivePreview";
import { useEffect } from "react";

// Refined premium color palette with fewer, carefully selected colors
const PREMIUM_COLORS = [
  "#1E293B", // Corporate Blue
  "#6366F1", // Indigo
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
];

export function AppearanceSection() {
  const { formData, updateFormData, goToNextStep } = useCardCreator();

  // Templates with their image paths and descriptions
  const templates = [
    {
      id: "modern",
      name: "Modern",
      description: "Dynamic color gradients with sleek finish",
      imagePath: "/images/modern.png",
      features: ["Color overlay", "Gradient background", "Premium finish"],
    },
    {
      id: "classic",
      name: "Classic",
      description: "Elegant side accent with refined details",
      imagePath: "/images/classic.png",
      features: ["Side accent", "Elegant lines", "Dark sophisticated look"],
    },
    {
      id: "minimalist",
      name: "Minimal",
      description: "Clean design with elegant corner accent",
      imagePath: "/images/minimalistic.png",
      features: ["Corner detail", "Geometric elements", "Space-focused layout"],
    },
  ];

  useEffect(() => {
    if (!formData.name && !formData.title) {
      updateFormData("name", "John Doe");
      updateFormData("title", "Product Designer");
      updateFormData("email", "john@example.com");
      updateFormData("company", "Design Studio");
      updateFormData("phone", "+1 234 567 890");
    }

    // Set default color if not already set
    if (!formData.color) {
      updateFormData("color", "#6366F1");
    }

    // Set default template if not already set
    if (!formData.template) {
      updateFormData("template", "modern");
    }
  }, []);

  // Handle the continue button click explicitly
  const handleContinue = () => {
    goToNextStep();
  };

  // Handle color selection from the premium color grid
  const handleColorSelect = (color: string) => {
    updateFormData("color", color);
  };

  const getTemplateStyles = () => {
    switch (formData.template) {
      case "modern":
        return {
          textColor: "#FFFFFF",
          secondaryColor: "rgba(255,255,255,0.9)",
          containerStyle: "bg-gradient-to-br",
          contentClass: "relative z-10",
          overlayStyle:
            "absolute inset-0 bg-gradient-to-br from-black/30 to-black/50",
          backgroundOpacity: 0.95,
        };
      case "classic":
        return {
          textColor: "#FFFFFF", // Changed to white for better contrast on dark background
          secondaryColor: "rgba(255,255,255,0.9)",
          containerStyle: "bg-gradient-to-br from-gray-800 to-gray-900",
          contentClass: "relative z-10",
          overlayStyle: `absolute inset-0 bg-gradient-to-b from-${formData.color}/80 via-${formData.color}/40 to-${formData.color}/60`,
          backgroundOpacity: 0.75,
        };
      case "minimalist":
        return {
          textColor: "#1A1A1A",
          secondaryColor: "rgba(0,0,0,0.8)",
          containerStyle: "bg-white",
          contentClass: "relative z-10", // Removed margin to match new design
          overlayStyle: `absolute inset-0 bg-gradient-to-b from-transparent to-${formData.color}/5`,
          backgroundOpacity: 0.9,
        };
      default:
        return {
          textColor: "#FFFFFF",
          secondaryColor: "rgba(255,255,255,0.8)",
          containerStyle: "",
          contentClass: "",
          overlayStyle: "",
          backgroundOpacity: 1,
        };
    }
  };

  return (
    <FormSectionWrapper
      title="Card Appearance"
      description="Customize how your card looks"
      icon={<Palette className="h-5 w-5" />}
      nextDisabled={false}
      onNextClick={handleContinue}
    >
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary/80" />
              Brand Color
            </Label>
            <span className="text-xs text-muted-foreground">
              Select a premium color
            </span>
          </div>

          <div className="p-4 sm:p-6 bg-muted/30 rounded-xl border border-border/60 shadow-sm">
            <ColorPicker
              selectedColor={formData.color}
              setSelectedColor={(color) => updateFormData("color", color)}
            />

            {/* Premium colors with enhanced circular design - improved for mobile */}
            <div className="mt-6 sm:mt-8 relative">
              <Label className="text-sm text-foreground/80 font-medium mb-3 block flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary/70" />
                Premium Color Selection
              </Label>

              {/* Responsive container for color circles */}
              <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 mt-2 sm:mt-3">
                {PREMIUM_COLORS.map((color) => (
                  <motion.div
                    key={color}
                    whileHover={{ y: -2, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleColorSelect(color)}
                    className={cn(
                      "h-7 w-7 sm:h-8 sm:w-8 rounded-full cursor-pointer border transition-all duration-200 flex items-center justify-center relative shadow-sm hover:shadow-md",
                      formData.color.toLowerCase() === color.toLowerCase()
                        ? "border-primary shadow-lg ring-2 ring-primary/30"
                        : "border-border/40 hover:border-primary/50",
                    )}
                    style={{ backgroundColor: color }}
                  >
                    {/* White dot in center when selected */}
                    {formData.color.toLowerCase() === color.toLowerCase() ? (
                      <div className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-inner"></div>
                    ) : (
                      /* Small white dot at top for all */
                      <div className="absolute top-[3px] w-1 h-1 bg-white/80 rounded-full"></div>
                    )}

                    {/* Enhanced gradient for 3D effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-black/30" />
                  </motion.div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground mt-4 sm:mt-5 text-center">
                Choose a premium color that reflects your brand identity
              </p>
            </div>
          </div>
        </motion.div>

        {/* Templates section - improved for mobile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary/80" />
              Card Template
            </Label>
            <span className="hidden xs:inline-flex text-xs text-primary items-center gap-1">
              <EyeIcon className="h-3 w-3" /> Live preview updates as you select
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {templates.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateFormData("template", template.id)}
                className={cn(
                  "relative cursor-pointer transition-all duration-200 border rounded-lg group overflow-hidden",
                  formData.template === template.id
                    ? "border-primary shadow-md bg-primary/5 ring-1 ring-primary/20"
                    : "border-border/40 hover:border-primary/50",
                )}
              >
                {/* Template image preview with color overlay */}
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={template.imagePath}
                    alt={`${template.name} template`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    style={{
                      filter:
                        formData.template === template.id
                          ? "none"
                          : "grayscale(0.5)",
                    }}
                  />

                  {/* Color overlay based on selected color */}
                  <div
                    className="absolute inset-0 mix-blend-multiply opacity-40 transition-opacity group-hover:opacity-60"
                    style={{ backgroundColor: formData.color }}
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-sm">{template.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {template.description}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {template.features.map((feature, index) => (
                      <li
                        key={index}
                        className="text-xs text-muted-foreground flex items-center"
                      >
                        <Check className="h-3 w-3 mr-1 text-primary/70" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Selection indicator */}
                <AnimatePresence>
                  {formData.template === template.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="absolute top-2 right-2 bg-primary rounded-full p-1.5 shadow-md"
                    >
                      <Check className="h-3 w-3 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 relative overflow-hidden rounded-lg border border-border/40 bg-gradient-to-br from-muted/10 to-card/20"
        >
          <div className="p-4 sm:p-6 backdrop-blur-sm">
            <div className="text-sm font-medium mb-4 flex justify-between items-center border-b border-border/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <span>Interactive Preview</span>
              </div>
              <span className="text-xs text-primary/80 bg-primary/5 px-2 py-1 rounded-full">
                Hover to interact
              </span>
            </div>
            <div className="w-full h-[250px] sm:h-72 relative rounded flex items-center justify-center">
              <LivePreview
                data={{
                  name: formData.name || "Your Name",
                  title: formData.title || "Your Title",
                  email: formData.email || "email@example.com",
                  color: formData.color,
                  template: formData.template,
                  company: formData.company || "Company Name",
                  phone: formData.phone || "+1 234 567 8900",
                }}
                interactive={true}
                className="max-w-[300px] sm:max-w-[350px] transform-gpu shadow-xl"
              />
            </div>
            
            {/* Template specific tips */}
            <div className="mt-4 text-xs text-muted-foreground bg-card/50 p-3 rounded-md border border-border/20">
              <p className="font-medium text-foreground/70 mb-1">Template Tips:</p>
              {formData.template === "modern" && (
                <p>Modern template works best with vibrant colors that create eye-catching gradients.</p>
              )}
              {formData.template === "classic" && (
                <p>Classic template features an elegant side accent with horizontal lines and a dark sophisticated background for a premium executive look.</p>
              )}
              {formData.template === "minimalist" && (
                <p>Minimalist template features a distinctive corner accent and subtle geometric elements that highlight your information.</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </FormSectionWrapper>
  );
}

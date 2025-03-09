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

export function AppearanceSection() {
  const { formData, updateFormData, goToNextStep } = useCardCreator();

  // Templates with their image paths and descriptions
  const templates = [
    {
      id: "modern",
      name: "Modern",
      description: "Sleek with gradients and rounded corners",
      imagePath: "/images/modern.png",
      features: ["Rounded corners", "Gradient overlays", "Hover effects"],
    },
    {
      id: "classic",
      name: "Classic",
      description: "Traditional, elegant, and timeless",
      imagePath: "/images/classic.png",
      features: ["Clean design", "Professional look", "Border accents"],
    },
    {
      id: "minimalist",
      name: "minimalist",
      description: "Simple, clean, and to the point",
      imagePath: "/images/minimalistic.png",
      features: ["Minimal design", "Focus on content", "Elegant typography"],
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
  }, []);

  // Handle the continue button click explicitly
  const handleContinue = () => {
    goToNextStep();
  };

  const premiumColors = [
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#10b981",
    "#f59e0b",
    "#ef4444",

    "#1e293b",
    "#312e81",
    "#065f46",
    "#831843",

    "#93c5fd",
    "#a5b4fc",
    "#c4b5fd",
    "#86efac",
    "#fcd34d",
  ];

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
              Select or customize your color
            </span>
          </div>

          <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
            <ColorPicker
              selectedColor={formData.color}
              setSelectedColor={(color) => updateFormData("color", color)}
            />

            <div className="mt-4">
              <Label className="text-xs text-muted-foreground mb-2 block">
                Premium Color Palette
              </Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {premiumColors.map((color) => (
                  <motion.div
                    key={color}
                    whileHover={{ y: -2, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateFormData("color", color)}
                    className={cn(
                      "h-8 w-8 rounded-full cursor-pointer border-2 transition-all duration-200",
                      formData.color.toLowerCase() === color.toLowerCase()
                        ? "border-primary scale-110 shadow-md"
                        : "border-transparent hover:border-primary/50",
                    )}
                    style={{ backgroundColor: color }}
                  >
                    {formData.color.toLowerCase() === color.toLowerCase() && (
                      <div className="h-full w-full flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-white shadow-sm"></div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

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
            <span className="text-xs text-primary inline-flex items-center gap-1">
              <EyeIcon className="h-3 w-3" /> Live preview updates as you select
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                {/* Template image preview */}
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
                    className="absolute inset-0 mix-blend-color opacity-60 transition-opacity group-hover:opacity-80"
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
          <div className="p-6 backdrop-blur-sm">
            <div className="text-sm font-medium mb-4 flex justify-between items-center border-b border-border/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <span>Interactive 3D Preview</span>
              </div>
              <span className="text-xs text-primary/80 bg-primary/5 px-2 py-1 rounded-full">
                Hover to interact
              </span>
            </div>
            <div className="w-full h-72 relative rounded flex items-center justify-center">
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
                className="max-w-[350px] transform-gpu shadow-xl"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </FormSectionWrapper>
  );
}

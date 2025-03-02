"use client";

import { useCardCreator } from "./CardCreatorContext";
import { FormSectionWrapper } from "./shared/FormSectionWrapper";
import { Label } from "@/components/ui/label";
import { Palette, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ColorPicker from "@/components/ColorPicker";

export function AppearanceSection() {
  const { formData, updateFormData, goToNextStep } = useCardCreator();

  // Templates with their visual representations
  const templates = [
    {
      id: "modern",
      name: "Modern",
      description: "Sleek with gradients and rounded corners",
      style: {
        backgroundColor: formData.color,
        borderRadius: "0.75rem",
        padding: "1.5rem",
        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
        border: "1px solid rgba(255,255,255,0.2)",
      },
    },
    {
      id: "classic",
      name: "Classic",
      description: "Traditional, elegant, and timeless",
      style: {
        backgroundColor: formData.color,
        borderRadius: "0.25rem",
        padding: "1.5rem",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        border: "1px solid rgba(0,0,0,0.1)",
      },
    },
    {
      id: "minimalist",
      name: "Minimalist",
      description: "Simple, clean, and to the point",
      style: {
        backgroundColor: formData.color,
        borderRadius: "0.5rem",
        padding: "1.5rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        border: "none",
      },
    },
  ];

  // Handle the continue button click explicitly
  const handleContinue = () => {
    goToNextStep();
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
          className="space-y-3"
        >
          <Label className="text-sm font-medium">Card Color</Label>
          <ColorPicker
            selectedColor={formData.color}
            setSelectedColor={(color) => updateFormData("color", color)}
          />

          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "#6366f1",
              "#ec4899",
              "#10b981",
              "#f59e0b",
              "#ef4444",
              "#8b5cf6",
            ].map((color) => (
              <motion.div
                key={color}
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateFormData("color", color)}
                className={cn(
                  "h-8 w-8 rounded-full cursor-pointer border-2 transition-all duration-200",
                  formData.color === color
                    ? "border-primary scale-110"
                    : "border-transparent hover:border-primary/50",
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </motion.div>

        {/* Template selection */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <Label className="text-sm font-medium">Card Template</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {templates.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateFormData("template", template.id)}
                className={cn(
                  "relative cursor-pointer transition-all duration-200 border group",
                  formData.template === template.id
                    ? "border-primary bg-primary/5"
                    : "border-border/40 hover:border-primary/50",
                )}
              >
                {/* Template preview */}
                <div className="p-4">
                  <div
                    className="h-24 mb-3 w-full transition-all duration-300 group-hover:opacity-90"
                    style={template.style}
                  >
                    <div className="h-4 w-3/4 bg-white bg-opacity-25 rounded-full mb-2"></div>
                    <div className="h-3 w-1/2 bg-white bg-opacity-15 rounded-full"></div>
                  </div>
                  <h3 className="font-medium text-sm">{template.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {template.description}
                  </p>
                </div>

                {/* Selection indicator */}
                <AnimatePresence>
                  {formData.template === template.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="absolute top-2 right-2 bg-primary rounded-full p-1"
                    >
                      <Check className="h-3 w-3 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Live preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 relative overflow-hidden rounded-lg border border-border/40"
        >
          <div className="p-4 bg-card/20 backdrop-blur-sm">
            <div className="text-sm font-medium text-muted-foreground mb-3">
              Live Preview
            </div>
            <div
              className="w-full h-36 relative rounded transition-all duration-500"
              style={{
                backgroundColor: formData.color,
                borderRadius:
                  formData.template === "modern"
                    ? "0.75rem"
                    : formData.template === "minimalist"
                    ? "0.5rem"
                    : "0.25rem",
                padding: "1.5rem",
                boxShadow:
                  formData.template === "modern"
                    ? "0 10px 15px -3px rgba(0,0,0,0.1)"
                    : formData.template === "minimalist"
                    ? "0 1px 3px rgba(0,0,0,0.05)"
                    : "0 4px 6px rgba(0,0,0,0.1)",
                border:
                  formData.template === "modern"
                    ? "1px solid rgba(255,255,255,0.2)"
                    : formData.template === "minimalist"
                    ? "none"
                    : "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                <div>
                  <div
                    className="text-lg font-bold mb-1"
                    style={{
                      color:
                        formData.template === "modern" ? "#ffffff" : "#000000",
                    }}
                  >
                    {formData.name || "Your Name"}
                  </div>
                  <div
                    className="text-sm"
                    style={{
                      color:
                        formData.template === "modern"
                          ? "rgba(255,255,255,0.9)"
                          : "rgba(0,0,0,0.7)",
                    }}
                  >
                    {formData.title || "Your Title"}
                  </div>
                </div>
                {formData.email && (
                  <div
                    className="text-xs"
                    style={{
                      color:
                        formData.template === "modern"
                          ? "rgba(255,255,255,0.7)"
                          : "rgba(0,0,0,0.5)",
                    }}
                  >
                    {formData.email}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </FormSectionWrapper>
  );
}

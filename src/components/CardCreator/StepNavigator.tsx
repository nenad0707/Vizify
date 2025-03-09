"use client";

import React from "react";
import { User, Palette, CheckCircle, Check, ChevronsRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCardCreator } from "./CardCreatorContext";

export const steps = [
  {
    id: "userDetails",
    title: "Personal Info",
    description: "Add your professional details",
  },
  {
    id: "appearance",
    title: "Card Design",
    description: "Choose style & colors",
  },
  {
    id: "review",
    title: "Review & Create",
    description: "Preview and finalize",
  },
];

interface StepNavigatorProps {
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

export function StepNavigator({
  currentStep,
  onStepClick,
}: StepNavigatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-start justify-between">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "relative flex flex-col items-center group flex-1",
              index !== steps.length - 1 && "pr-8", // Add padding for the line except last item
            )}
          >
            {/* Line connector */}
            {index !== steps.length - 1 && (
              <>
                <div
                  className={cn(
                    "absolute w-full h-[2px] top-4 left-[60%]",
                    currentStep > index
                      ? "bg-primary"
                      : "bg-muted-foreground/20",
                  )}
                />
                <motion.div
                  className="absolute top-3 left-[70%]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: currentStep > index ? 1 : 0 }}
                >
                  <ChevronsRight className="h-5 w-5 text-primary" />
                </motion.div>
              </>
            )}

            {/* Step circle */}
            <motion.button
              onClick={() => onStepClick?.(index)}
              className={cn(
                "relative w-8 h-8 rounded-full border-2 flex items-center justify-center mb-3 transition-colors",
                currentStep === index &&
                  "border-primary bg-primary/10 text-primary",
                currentStep > index &&
                  "border-primary bg-primary text-primary-foreground",
                currentStep < index &&
                  "border-muted-foreground/30 text-muted-foreground",
                onStepClick && "cursor-pointer hover:border-primary/80",
              )}
              whileHover={onStepClick ? { scale: 1.05 } : undefined}
              whileTap={onStepClick ? { scale: 0.95 } : undefined}
            >
              {currentStep > index ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="text-sm">{index + 1}</span>
              )}

              {/* Ping animation for current step */}
              {currentStep === index && (
                <motion.span
                  className="absolute inset-0 rounded-full border-2 border-primary"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: [0, 0.2, 0],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.button>

            {/* Step text */}
            <div
              className={cn(
                "text-center transition-colors",
                currentStep >= index
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              <p className="font-medium text-sm">{step.title}</p>
              <p className="text-xs opacity-80">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

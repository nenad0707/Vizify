"use client";

import React from "react";
import { User, Palette, CheckCircle, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCardCreator } from "./CardCreatorContext";

export const StepNavigator = () => {
  const { currentStep, validateStep, goToPrevStep, goToNextStep } =
    useCardCreator();

  // Define the steps
  const steps = [
    {
      id: 0,
      name: "Your Details",
      description: "Basic information",
      icon: User,
    },
    {
      id: 1,
      name: "Appearance",
      description: "Style your card",
      icon: Palette,
    },
    {
      id: 2,
      name: "Review",
      description: "Finalize your card",
      icon: CheckCircle,
    },
  ];

  // Ensure currentStep is within valid range
  const safeCurrentStep = Math.min(Math.max(0, currentStep), steps.length - 1);

  // Calculate if step is completed, active, or disabled
  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < safeCurrentStep) {
      return "completed"; // Steps before current are completed
    } else if (stepIndex === safeCurrentStep) {
      return "active"; // Current step is active
    } else {
      return "disabled"; // Steps after current are disabled
    }
  };

  // Improved function for step navigation
  const handleStepClick = (stepIndex: number) => {
    const currentStepIsValid = validateStep();

    if (stepIndex < safeCurrentStep) {
      // Navigation backward is always allowed
      for (let i = safeCurrentStep; i > stepIndex; i--) {
        goToPrevStep();
      }
    } else if (stepIndex === safeCurrentStep + 1 && currentStepIsValid) {
      // Allow proceeding to next step only if current is valid
      goToNextStep();
    }
    // Otherwise do nothing - prevent skipping steps
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mb-8 bg-card/80 backdrop-blur-sm border border-border/30 p-4 rounded-lg shadow-md"
    >
      {/* Mobile view - Step indicator */}
      <div className="flex items-center justify-between mb-4 md:hidden">
        <motion.span
          className="text-sm font-medium bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          Step {safeCurrentStep + 1} of {steps.length}
        </motion.span>
        <span className="text-sm text-muted-foreground">
          {steps[safeCurrentStep]?.name || "Step"}
        </span>
      </div>

      {/* Mobile view - Progress bar */}
      <div className="w-full bg-muted h-1.5 rounded-full mb-6 md:hidden overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-primary to-primary/80 h-full rounded-full"
          initial={{ width: "0%" }}
          animate={{
            width: `${((safeCurrentStep + 1) / steps.length) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Desktop view - Step navigator */}
      <div className="hidden md:block">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center">
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              const isClickable = index <= safeCurrentStep;
              const StepIcon = step.icon;

              return (
                <li
                  key={step.name}
                  className={cn(
                    "relative flex items-center",
                    index !== steps.length - 1
                      ? "w-full"
                      : "w-10" /* Make all steps except the last take full width */,
                  )}
                >
                  {/* Step indicator */}
                  <div
                    onClick={() => isClickable && handleStepClick(index)}
                    className={cn(
                      "group flex items-center transition-all relative",
                      isClickable ? "cursor-pointer" : "cursor-not-allowed",
                    )}
                    aria-current={status === "active" ? "step" : undefined}
                  >
                    <span
                      className="absolute top-0 left-0 w-full h-0.5 -translate-y-1/2"
                      aria-hidden="true"
                    >
                      {/* Step connection line before current step */}
                      {index > 0 && (
                        <motion.span
                          className={cn("absolute inset-0 h-full bg-muted", {
                            "bg-gradient-to-r from-primary/70 to-primary":
                              index <= safeCurrentStep,
                          })}
                          initial={{ width: "0%" }}
                          animate={{
                            width: index <= safeCurrentStep ? "100%" : "0%",
                          }}
                          transition={{ duration: 0.8, ease: "easeInOut" }}
                        />
                      )}
                    </span>

                    {/* Step circle with improved contrast */}
                    <motion.span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full transition-all",
                        {
                          "border-2 border-primary bg-primary/20 backdrop-blur-sm text-primary font-medium shadow-[0_0_10px_rgba(99,102,241,0.3)]":
                            status === "active",
                          "border-2 border-primary bg-primary text-white shadow-md":
                            status === "completed",
                          "border-2 border-muted bg-background/70 backdrop-blur-sm text-muted-foreground/90":
                            status === "disabled",
                        },
                      )}
                      whileHover={isClickable ? { scale: 1.05 } : {}}
                      whileTap={isClickable ? { scale: 0.95 } : {}}
                    >
                      <AnimatePresence mode="wait">
                        {status === "completed" ? (
                          <motion.span
                            key="check"
                            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="flex items-center justify-center"
                          >
                            <Check
                              className="h-5 w-5 text-white"
                              aria-hidden="true"
                            />
                          </motion.span>
                        ) : (
                          <motion.span
                            key="icon"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="flex items-center justify-center"
                          >
                            <StepIcon className="h-5 w-5" aria-hidden="true" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.span>
                  </div>

                  {/* Step content (displayed next to the circle) */}
                  {index !== steps.length - 1 && (
                    <div className="ml-4 w-full">
                      <motion.div
                        className={cn("flex flex-col items-start text-sm", {
                          "text-primary font-medium": status === "active",
                          "text-foreground/80": status === "completed",
                          "text-muted-foreground/90": status === "disabled",
                        })}
                        whileHover={{ x: isClickable ? 3 : 0 }}
                      >
                        <span
                          className={cn(
                            "font-medium",
                            status === "active" &&
                              "bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent",
                          )}
                        >
                          {step.name}
                        </span>
                        <span
                          className={cn("text-xs", {
                            "text-muted-foreground": status === "active",
                            "text-muted": status !== "active",
                          })}
                        >
                          {step.description}
                        </span>
                      </motion.div>
                    </div>
                  )}

                  {/* Last step content with premium styling */}
                  {index === steps.length - 1 && (
                    <div className="ml-4 min-w-0">
                      <motion.div
                        className={cn("text-sm font-medium", {
                          "bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent":
                            status === "active",
                          "text-muted-foreground": status !== "active",
                        })}
                        whileHover={{ x: isClickable ? 3 : 0 }}
                      >
                        {step.name}
                        <span className="hidden sm:block text-xs text-muted-foreground">
                          {step.description}
                        </span>
                      </motion.div>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </motion.div>
  );
};

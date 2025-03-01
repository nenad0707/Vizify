"use client";

import React from "react";
import { User, Palette, CheckCircle, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCardCreator } from "./CardCreatorContext";

export const StepNavigator = ({ compact = false }) => {
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
      return "completed";
    } else if (stepIndex === safeCurrentStep) {
      return "active";
    } else {
      return "disabled";
    }
  };

  const handleStepClick = (stepIndex: number) => {
    const currentStepIsValid = validateStep();

    if (stepIndex < safeCurrentStep) {
      for (let i = safeCurrentStep; i > stepIndex; i--) {
        goToPrevStep();
      }
    } else if (stepIndex === safeCurrentStep + 1 && currentStepIsValid) {
      goToNextStep();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "w-full bg-card/50 backdrop-blur-sm border border-border/30 rounded-lg shadow-sm",
        compact ? "mb-2 p-2" : "mb-8 p-4",
      )}
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

      <div className="hidden md:block">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center justify-between">
            {" "}
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              const isClickable = index <= safeCurrentStep;
              const StepIcon = step.icon;

              return (
                <li
                  key={step.name}
                  className={cn(
                    "relative flex items-center",
                    index !== steps.length - 1 ? "flex-1" : "w-auto",
                  )}
                >
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

                    <motion.span
                      className={cn(
                        "flex items-center justify-center rounded-full transition-all",
                        compact ? "h-7 w-7" : "h-10 w-10",
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
                              className={cn(
                                compact ? "h-4 w-4" : "h-5 w-5",
                                "text-white",
                              )}
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
                            <StepIcon
                              className={compact ? "h-4 w-4" : "h-5 w-5"}
                              aria-hidden="true"
                            />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.span>
                  </div>

                  {index !== steps.length - 1 && (
                    <div className={cn("ml-2 max-w-[110px]")}>
                      {" "}
                      <motion.div
                        className={cn("flex flex-col items-start", {
                          "text-primary font-medium": status === "active",
                          "text-foreground/80": status === "completed",
                          "text-muted-foreground/90": status === "disabled",
                        })}
                        whileHover={{ x: isClickable ? 1 : 0 }}
                      >
                        <span
                          className={cn(
                            "font-medium truncate w-full",
                            compact ? "text-xs" : "text-sm",
                            status === "active" &&
                              "bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent",
                          )}
                        >
                          {step.name}
                        </span>
                        {!compact && (
                          <span
                            className={cn("text-xs truncate w-full", {
                              "text-muted-foreground": status === "active",
                              "text-muted": status !== "active",
                            })}
                          >
                            {step.description}
                          </span>
                        )}
                      </motion.div>
                    </div>
                  )}

                  {index === steps.length - 1 && (
                    <div className={cn("ml-3", compact ? "ml-2" : "ml-4")}>
                      <motion.div
                        className={cn(
                          "font-medium",
                          compact ? "text-xs" : "text-sm",
                          {
                            "bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent":
                              status === "active",
                            "text-muted-foreground": status !== "active",
                          },
                        )}
                        whileHover={{ x: isClickable ? 2 : 0 }}
                      >
                        {step.name}
                        {!compact && (
                          <span className="hidden sm:block text-xs text-muted-foreground">
                            {step.description}
                          </span>
                        )}
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

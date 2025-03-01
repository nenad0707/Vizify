"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useCardCreator } from "../CardCreatorContext";
import { cn } from "@/lib/utils";

interface FormSectionWrapperProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  nextDisabled?: boolean;
  isLastStep?: boolean;
  onNextClick?: () => void; // Add this new prop
}

export function FormSectionWrapper({
  title,
  description,
  icon,
  children,
  nextDisabled = false,
  isLastStep = false,
  onNextClick, // Use this new prop
}: FormSectionWrapperProps) {
  const { goToNextStep, goToPrevStep, currentStep, isSubmitting, submitForm } =
    useCardCreator();

  // Handle next button click with explicit validation
  const handleNextClick = () => {
    // If custom handler is provided, use it, otherwise use default
    if (onNextClick) {
      onNextClick();
    } else if (isLastStep) {
      submitForm();
    } else {
      goToNextStep();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="bg-card/80 backdrop-blur-md border border-border/50 shadow-lg overflow-hidden">
        <CardHeader className="pb-5 bg-gradient-to-br from-background/90 to-muted/30">
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              className="p-2.5 rounded-full bg-primary/10 backdrop-blur-sm text-primary border border-primary/20 shadow-inner"
              whileHover={{ rotate: 5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              {icon}
            </motion.div>
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {title}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-0.5">
                {description}
              </CardDescription>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="w-full h-1 bg-muted/70 rounded-full overflow-hidden mt-3 shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary/70"
              initial={{ width: `${(currentStep / 3) * 100}%` }}
              animate={{ width: `${((currentStep + 1) / 3) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </div>
        </CardHeader>

        <CardContent className="px-6 pt-6 pb-6">
          <div className="space-y-6">{children}</div>
        </CardContent>

        <CardFooter
          className={cn(
            "flex justify-between pt-4 pb-6 px-6 border-t border-border/20 bg-card/30",
            currentStep === 0 ? "justify-end" : "justify-between",
          )}
        >
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={goToPrevStep}
              className="flex items-center gap-1.5 group hover:bg-background hover:text-foreground transition-all duration-300 backdrop-blur-sm"
              disabled={isSubmitting}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </Button>
          )}

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              onClick={handleNextClick} // Use our new handler
              disabled={nextDisabled || isSubmitting}
              className={cn(
                "flex items-center gap-1.5 shadow-md transition-all",
                isLastStep
                  ? "bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400"
                  : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70",
              )}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>{isLastStep ? "Creating..." : "Processing..."}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <span className="font-medium">
                    {isLastStep ? "Create Card" : "Continue"}
                  </span>
                  {isLastStep ? (
                    <CheckCircle2 className="w-4 h-4 ml-1 group-hover:scale-110 transition-transform" />
                  ) : (
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  )}
                </div>
              )}
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

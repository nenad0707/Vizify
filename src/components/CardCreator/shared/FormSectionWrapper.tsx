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
  onNextClick?: () => void;
  nextLabel?: string;
  nextIcon?: ReactNode;
  showBackButton?: boolean;  // Add this prop
  onBackClick?: () => void;  // Add this prop
}

export function FormSectionWrapper({
  title,
  description,
  icon,
  children,
  nextDisabled = false,
  isLastStep = false,
  onNextClick,
  nextLabel = "Continue",
  nextIcon,
  showBackButton = false,  // Add default value
  onBackClick,            // Add this parameter
}: FormSectionWrapperProps) {
  const { goToNextStep, goToPrevStep, currentStep, isSubmitting, submitForm } =
    useCardCreator();

  const handleNextClick = () => {
    if (onNextClick) {
      onNextClick();
    } else if (isLastStep) {
      submitForm();
    } else {
      goToNextStep();
    }
  };

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      goToPrevStep();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto"
      style={{ zIndex: 100 }}
    >
      <Card className="bg-white dark:bg-black border border-border/70 shadow-md overflow-hidden">
        <CardHeader className="pb-2 pt-3 px-4 bg-gradient-to-r from-background to-muted/5">
          <div className="flex items-center gap-2 mb-1.5">
            <motion.div
              className="p-1.5 rounded-full bg-primary/10 backdrop-blur-sm text-primary border border-primary/20 shadow-inner"
              whileHover={{ rotate: 5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              {icon}
            </motion.div>
            <div>
              <CardTitle className="text-base bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {title}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {description}
              </CardDescription>
            </div>
          </div>

          <div className="w-full h-1 bg-muted/50 rounded-full overflow-hidden mt-1 shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary/70"
              initial={{ width: `${(currentStep / 3) * 100}%` }}
              animate={{ width: `${((currentStep + 1) / 3) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </div>
        </CardHeader>

        <CardContent className="px-4 pt-3 pb-2">
          <div className="space-y-3">{children}</div>
        </CardContent>

        <CardFooter
          className={cn(
            "flex justify-between border-t border-border/10 bg-muted/5 pt-2 pb-2 px-4",
            !showBackButton && currentStep === 0 ? "justify-end" : "justify-between",
          )}
        >
          {/* Use showBackButton prop instead of currentStep check */}
          {(showBackButton || currentStep > 0) && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackClick}
              className="flex items-center gap-1.5 group hover:bg-background hover:text-foreground transition-all"
              disabled={isSubmitting}
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </Button>
          )}

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              size="sm"
              onClick={handleNextClick}
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
                    {isLastStep ? "Create Card" : nextLabel}
                  </span>
                  {isLastStep ? (
                    <CheckCircle2 className="w-4 h-4 ml-1 group-hover:scale-110 transition-transform" />
                  ) : (
                    nextIcon || <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
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

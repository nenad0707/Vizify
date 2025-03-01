"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Use sonner instead of custom toast

// Define interface for form data
export interface CardFormData {
  name: string;
  title: string;
  email: string;
  color: string;
  template: "modern" | "classic" | "minimalist";
}

// Define interface for status message
interface StatusMessage {
  type: "success" | "error";
  message: string;
}

// Define interface for context value
interface CardCreatorContextValue {
  formData: CardFormData;
  currentStep: number;
  isSubmitting: boolean;
  statusMessage: StatusMessage | null;
  createdCard: any | null;
  updateFormData: (field: keyof CardFormData, value: any) => void;
  updateFormDataBulk: (data: Partial<CardFormData>) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  submitForm: () => Promise<void>;
  validateStep: (step?: number) => boolean;
  resetForm: () => void;
}

// Create context
const CardCreatorContext = createContext<CardCreatorContextValue | undefined>(
  undefined,
);

// Provider component
export const CardCreatorProvider = ({ children }: { children: ReactNode }) => {
  // Initialize form state
  const [formData, setFormData] = useState<CardFormData>({
    name: "",
    title: "",
    email: "",
    color: "#6366f1",
    template: "modern",
  });

  // Initialize other state
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(
    null,
  );
  const [createdCard, setCreatedCard] = useState<any | null>(null);
  const router = useRouter();

  // Update a single form field
  const updateFormData = (field: keyof CardFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Update multiple form fields at once
  const updateFormDataBulk = (data: Partial<CardFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  // Validate current step - FIX THE VALIDATION FOR STEP 1
  const validateStep = (step = currentStep): boolean => {
    switch (step) {
      case 0: // Personal details step
        return !!formData.name && !!formData.title;
      case 1: // Appearance step - was incorrectly checking email
        return true; // Appearance should always be valid since we have defaults
      case 2: // Review step
        return true; // Review is always valid
      default:
        return true;
    }
  };

  // Go to next step with improved logging to help debug
  const goToNextStep = () => {
    console.log("Attempting to go to next step. Current step:", currentStep);
    console.log("Is step valid?", validateStep());

    if (validateStep()) {
      setCurrentStep((prev) => {
        const newStep = prev + 1;
        console.log("Moving to step:", newStep);
        return newStep;
      });
      setStatusMessage(null);
    } else {
      console.log("Step validation failed");
      setStatusMessage({
        type: "error",
        message: "Please fill in all required fields correctly.",
      });
    }
  };

  // Go to previous step
  const goToPrevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
    setStatusMessage(null);
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      name: "",
      title: "",
      email: "",
      color: "#6366f1",
      template: "modern",
    });
    setCurrentStep(0);
    setStatusMessage(null);
    setCreatedCard(null);
  };

  // Submit form data with Sonner toast only (no duplicate message)
  const submitForm = async () => {
    // Final validation
    if (!validateStep(0) || !validateStep(1) || !validateStep(2)) {
      setStatusMessage({
        type: "error",
        message: "Please ensure all required fields are filled correctly.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const response = await fetch("/api/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 409) {
        // Handle conflict (card with same name exists)
        const errorData = await response.json();
        throw new Error(
          errorData.error || "A card with this name already exists.",
        );
      } else if (!response.ok) {
        throw new Error(
          `Failed to create card: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      setCreatedCard(data);

      // Show only toast notification, not UI message
      toast.success("Card Created Successfully!", {
        description: "Redirecting to your new business card...",
        duration: 3000,
      });

      // Don't set success message in the UI to avoid duplication
      // We're redirecting anyway, so no need to show UI success message

      // Redirect after a brief delay
      setTimeout(() => {
        if (data && data.id) {
          router.push(`/card/${data.id}`);
        }
      }, 1000); // Reduced from 2000ms to 1000ms
    } catch (error) {
      console.error("Error creating card:", error);

      // Show error toast using Sonner
      toast.error("Error Creating Card", {
        description:
          error instanceof Error
            ? error.message
            : "An error occurred. Please try again.",
      });

      setStatusMessage({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while creating your card. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Context value
  const contextValue: CardCreatorContextValue = {
    formData,
    currentStep,
    isSubmitting,
    statusMessage,
    createdCard,
    updateFormData,
    updateFormDataBulk,
    goToNextStep,
    goToPrevStep,
    submitForm,
    validateStep,
    resetForm,
  };

  return (
    <CardCreatorContext.Provider value={contextValue}>
      {children}
    </CardCreatorContext.Provider>
  );
};

// Custom hook to use the card creator context
export const useCardCreator = () => {
  const context = useContext(CardCreatorContext);
  if (context === undefined) {
    throw new Error("useCardCreator must be used within a CardCreatorProvider");
  }
  return context;
};

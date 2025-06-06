"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Make sure your CardFormData interface aligns with BusinessCardData
export interface CardFormData {
  name: string;
  title: string;
  email: string;
  phone: string;
  company: string;
  color: string;
  template: string;
  backgroundColor?: string;
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
  resetForm: (keepCreatedCard?: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setCreatedCard: (card: any) => void;
}

// Create context
const CardCreatorContext = createContext<CardCreatorContextValue | undefined>(
  undefined,
);

// Ensure you have default values for all fields
const defaultFormData: CardFormData = {
  name: "",
  title: "",
  email: "",
  phone: "",
  company: "",
  color: "#6366F1", // Default color
  template: "modern", // Default template
  backgroundColor: "",
};

// Provider component
export const CardCreatorProvider = ({ children }: { children: ReactNode }) => {
  // Initialize form state
  const [formData, setFormData] = useState<CardFormData>(defaultFormData);

  // Initialize other state
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(
    null,
  );
  const [createdCard, setCreatedCard] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const validateStep = (step = currentStep): boolean => {
    switch (step) {
      case 0:
        return !!formData.name && !!formData.title;
      case 1:
        return true;
      case 2:
        return true;
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
  const resetForm = (keepCreatedCard = false) => {
    setFormData(defaultFormData);
    setCurrentStep(0);
    setStatusMessage(null);
    
    // Only reset createdCard if explicitly told to
    if (!keepCreatedCard) {
      setCreatedCard(null);
    }
  };

  const submitForm = async () => {
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
        const errorData = await response.json();

        setStatusMessage({
          type: "error",
          message: errorData.error || "A card with this name already exists.",
        });

        toast.error("Card Name Already Exists", {
          description: "Please choose a different name for your card.",
          duration: 5000,
        });

        return;
      } else if (!response.ok) {
        const errorData = await response.json();
        setStatusMessage({
          type: "error",
          message:
            errorData.error || `Failed to create card: ${response.status}`,
        });

        toast.error("Failed to Create Card", {
          description: `Please try again later. (${response.status})`,
          duration: 5000,
        });

        return;
      }

      const data = await response.json();
      
     
      setCreatedCard(data);
      
      

      toast.success("Card Created Successfully!", {
        description: "Your card is ready to share!",
      });

      setStatusMessage({
        type: "success",
        message: "Your card has been successfully created!",
      });
      
    } catch (error) {
      console.error("Network error while creating card:", error);

      setStatusMessage({
        type: "error",
        message:
          "Network error occurred. Please check your connection and try again.",
      });

      toast.error("Connection Error", {
        description:
          "Failed to communicate with server. Please check your network.",
        duration: 5000,
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
    isLoading,
    setIsLoading,
    setCreatedCard,
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

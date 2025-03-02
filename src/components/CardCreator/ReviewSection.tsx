"use client";

import { useCardCreator } from "./CardCreatorContext";
import { FormSectionWrapper } from "./shared/FormSectionWrapper";
import {
  CheckCircle2,
  AlertTriangle,
  Mail,
  User,
  Briefcase,
  Palette,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import QRCodeComponent from "@/components/QRCodeComponent";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

function isAlreadyExistsError(message: string): boolean {
  return message.includes("already exists");
}

export function ReviewSection() {
  const { formData, statusMessage, submitForm, isSubmitting, createdCard } =
    useCardCreator();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Create a placeholder URL for QR code preview
  const qrCodeUrl = createdCard?.id
    ? `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/card/${
        createdCard.id
      }`
    : `${window.location.origin}/card/preview`;

  // List all details for review
  const details = [
    {
      name: "Full Name",
      value: formData.name,
      icon: <User className="h-4 w-4" />,
      required: true,
    },
    {
      name: "Job Title",
      value: formData.title,
      icon: <Briefcase className="h-4 w-4" />,
      required: true,
    },
    {
      name: "Email",
      value: formData.email || "Not provided",
      icon: <Mail className="h-4 w-4" />,
      required: false,
    },
    {
      name: "Card Color",
      value: formData.color.toUpperCase(),
      icon: <Palette className="h-4 w-4" />,
      color: formData.color,
    },
    {
      name: "Template",
      value:
        formData.template.charAt(0).toUpperCase() + formData.template.slice(1),
      icon: <Palette className="h-4 w-4" />,
    },
  ];

  // Handle submission with redirection state
  const handleCreateCard = () => {
    if (!isRedirecting && !isSubmitting) {
      submitForm();
    }
  };

  return (
    <FormSectionWrapper
      title="Review Your Card"
      description="Confirm your details and create your card"
      icon={<CheckCircle2 className="h-5 w-5" />}
      nextDisabled={isSubmitting || isRedirecting}
      isLastStep={true}
      onNextClick={handleCreateCard}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ zIndex: 1000 }}
        className="relative bg-white dark:bg-black rounded-lg p-0.5"
      >
        <div className="space-y-6">
          <AnimatePresence>
            {statusMessage && statusMessage.type === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {statusMessage.message}
                    {isAlreadyExistsError(statusMessage.message) && (
                      <div className="mt-2 text-sm">
                        <strong>Try the following:</strong>
                        <ul className="list-disc pl-5 mt-1">
                          <li>Change the card name to something unique</li>
                          <li>
                            Go to your dashboard to manage your existing cards
                          </li>
                        </ul>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Card Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 relative"
          >
            <div
              className="w-full h-40 rounded-lg overflow-hidden relative"
              style={{
                backgroundColor: formData.color,
                borderRadius:
                  formData.template === "modern"
                    ? "0.75rem"
                    : formData.template === "minimalist"
                    ? "0.5rem"
                    : "0.25rem",
                boxShadow:
                  "0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                padding: "1.5rem",
              }}
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <h3
                    className="text-2xl font-bold"
                    style={{
                      color:
                        formData.template === "modern" ? "#ffffff" : "#000000",
                    }}
                  >
                    {formData.name}
                  </h3>
                  <p
                    className="text-lg"
                    style={{
                      color:
                        formData.template === "modern"
                          ? "rgba(255,255,255,0.9)"
                          : "rgba(0,0,0,0.7)",
                    }}
                  >
                    {formData.title}
                  </p>
                </div>
                {formData.email && (
                  <div
                    className="flex items-center gap-2"
                    style={{
                      color:
                        formData.template === "modern"
                          ? "rgba(255,255,255,0.8)"
                          : "rgba(0,0,0,0.6)",
                    }}
                  >
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{formData.email}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Details column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-medium">Card Details</h3>
              <div className="space-y-3 bg-card/40 backdrop-blur-sm p-4 rounded-lg border border-border/50">
                {details.map((detail, index) => (
                  <div key={detail.name}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {detail.icon}
                        <span className="text-sm">{detail.name}</span>
                        {detail.required && (
                          <span className="text-red-500 text-xs">*</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 font-medium">
                        {detail.color ? (
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: detail.color }}
                          />
                        ) : null}
                        <span>{detail.value}</span>
                      </div>
                    </div>
                    {index < details.length - 1 && (
                      <Separator className="my-3" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* QR code column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-medium">Your QR Code</h3>
              <div className="bg-card/40 backdrop-blur-sm p-4 rounded-lg border border-border/50 flex flex-col items-center">
                <div className="py-3">
                  {createdCard ? (
                    <QRCodeComponent url={qrCodeUrl} size={150} />
                  ) : (
                    <div className="relative">
                      <QRCodeComponent url={qrCodeUrl} size={150} />
                      <div className="absolute inset-0 bg-background/70 backdrop-blur-[1px] flex items-center justify-center">
                        <p className="text-xs text-center max-w-[120px] text-muted-foreground">
                          QR code will be generated after card creation
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {createdCard
                    ? "Scan this code to view your business card"
                    : "This QR code will be generated once you create your card"}
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg mt-6 border border-border/50"
          >
            {isSubmitting ? (
              <p className="text-center">Creating your card, please wait...</p>
            ) : isRedirecting ? (
              <p className="text-center text-green-600 flex items-center justify-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Redirecting to your new card...
              </p>
            ) : statusMessage?.type === "error" ? (
              <p className="text-center text-amber-600">
                Please review the error above and try again.
              </p>
            ) : (
              <p className="text-center">
                Please review your details carefully before creating your
                business card. Click the "Create Card" button below when ready.
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </FormSectionWrapper>
  );
}

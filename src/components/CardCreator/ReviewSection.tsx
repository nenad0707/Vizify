"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCardCreator } from "./CardCreatorContext";
import { FormSectionWrapper } from "./shared/FormSectionWrapper";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { CardPreviewModal } from "@/components/CardPreviewModal";

export function ReviewSection() {
  const router = useRouter();
  const { 
    formData, 
    goToPrevStep,
    isLoading,
    submitForm,
    statusMessage, 
    createdCard 
  } = useCardCreator();
  
  const [showModal, setShowModal] = useState(false);

  const handleCreateCard = async () => {
    await submitForm();
    setShowModal(true);
  };

  const handleModalClose = (redirected = false) => {
    setShowModal(false);
    if (redirected) {
      router.push("/dashboard");
    }
  };

  return (
    <FormSectionWrapper
      title="Review Your Card"
      description="Make sure everything looks good"
      icon={<CheckCircle className="h-5 w-5" />}
      nextLabel={isLoading ? "Creating..." : "Create Card"}
      nextIcon={isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
      showBackButton={true}
      onBackClick={goToPrevStep}
      nextDisabled={isLoading}
      onNextClick={handleCreateCard}
    >
      <div className="space-y-8">
        {/* Personal details section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Personal Information</Label>
            </div>

            <div className="bg-muted/20 rounded-lg border border-border/50 p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <p className="text-sm font-medium">{formData.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Title</Label>
                  <p className="text-sm font-medium">{formData.title}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="text-sm font-medium">{formData.email}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Phone</Label>
                  <p className="text-sm font-medium">{formData.phone}</p>
                </div>
                {formData.company && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Company</Label>
                    <p className="text-sm font-medium">{formData.company}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Design details section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="space-y-4">
            <Label className="text-sm font-medium">Design Selection</Label>
            <div className="bg-muted/20 rounded-lg border border-border/50 p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Template</Label>
                  <p className="text-sm font-medium capitalize">{formData.template}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Color</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: formData.color }}
                    />
                    <span className="text-sm font-medium font-mono">{formData.color}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Terms & conditions section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-4">
            <Label className="text-sm font-medium">Terms & Conditions</Label>
            <div className="bg-muted/20 rounded-lg border border-border/50 p-4">
              <p className="text-sm text-muted-foreground">
                By creating this card, you confirm that all information provided is accurate 
                and that you have the rights to use any uploaded content.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        {statusMessage && statusMessage.type === "error" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-destructive text-center"
          >
            {statusMessage.message}
          </motion.p>
        )}

        {/* Success Modal */}
        {showModal && createdCard && (
          <CardPreviewModal
            open={showModal}
            onOpenChange={handleModalClose}
            card={createdCard}
            allowRedirect={true}
          />
        )}
      </div>
    </FormSectionWrapper>
  );
}

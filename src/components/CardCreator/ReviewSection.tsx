"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCardCreator } from "./CardCreatorContext";
import { FormSectionWrapper } from "./shared/FormSectionWrapper";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import LivePreview from "@/components/LivePreview";
import { CardPreviewModal } from "@/components/CardPreviewModal";

export function ReviewSection() {
  const router = useRouter();
  const { 
    formData, 
    isSubmitting, 
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
      description="Make sure everything looks perfect"
      icon={<CheckCircle className="h-5 w-5" />}
      isLastStep={true}
      onNextClick={handleCreateCard}
    >
      {/* Preview Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Final Preview</Label>
        </div>

        <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border border-border/50 p-8">
          <div className="max-w-sm mx-auto">
            <LivePreview data={formData} interactive={true} />
          </div>
        </div>
      </motion.div>

      {/* Details Review */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <Label className="text-sm font-medium">Card Details</Label>
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
    </FormSectionWrapper>
  );
}

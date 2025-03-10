"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Loader2,
  UserCircle,
  Palette,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CardPreviewModal } from "@/components/CardPreviewModal";
import {
  CardCreatorProvider,
  useCardCreator,
} from "@/components/CardCreator/CardCreatorContext";
import { AuthRequired } from "@/components/AuthRequired";
import { UserDetailsSection } from "@/components/CardCreator/UserDetailsSection";
import { AppearanceSection } from "@/components/CardCreator/AppearanceSection";
import { ReviewSection } from "@/components/CardCreator/ReviewSection";

// Dynamic imports for better performance
const LivePreview = dynamic(() => import("@/components/LivePreview"), {
  ssr: false,
  loading: () => <PreviewSkeleton />,
});

const PreviewSkeleton = () => (
  <div className="flex items-center justify-center h-full bg-card/30 rounded-lg">
    <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
  </div>
);

// Step configuration with enhanced icons and descriptions
const STEPS = [
  {
    id: "details",
    title: "Personal Details",
    description: "Build your professional identity",
    icon: UserCircle,
  },
  {
    id: "design",
    title: "Brand & Design",
    description: "Choose your visual style",
    icon: Palette,
  },
  {
    id: "review",
    title: "Review & Create",
    description: "Finalize your business card",
    icon: CheckCircle,
  },
];

function StepNavigator({ currentStep }: { currentStep: number }) {
  return (
    <div className="relative flex items-center justify-between mb-8 px-2">
      {/* Progress bar background */}
      <div className="absolute h-0.5 bg-muted left-0 top-5 w-full -z-10" />

      {/* Active progress bar */}
      <div
        className="absolute h-0.5 bg-primary left-0 top-5 -z-10 transition-all duration-300"
        style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
      />

      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div key={step.id} className="flex flex-col items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                isCompleted
                  ? "bg-primary text-primary-foreground"
                  : isActive
                  ? "bg-primary/90 text-primary-foreground ring-4 ring-primary/20"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex flex-col items-center">
              <span
                className={`text-sm font-medium ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {step.title}
              </span>
              <span className="text-xs text-muted-foreground hidden sm:block">
                {step.description}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getCurrentStep() {
  const { currentStep } = useCardCreator();
  switch (currentStep) {
    case 0:
      return <UserDetailsSection />;
    case 1:
      return <AppearanceSection />;
    case 2:
      return <ReviewSection />;
    default:
      return null;
  }
}

function CardCreatorContent() {
  const { formData, currentStep, createdCard, resetForm } = useCardCreator();
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalClose = (redirected = false) => {
    if (!redirected) {
      setModalOpen(false);
      resetForm();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        {/* Header with enhanced styling */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link
            href="/dashboard"
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors group w-fit mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>

          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Create Your Digital Presence
            </h1>
            <p className="text-muted-foreground mt-3 text-lg">
              Design a professional business card that represents your brand.
              Follow our guided process to create something remarkable.
            </p>
          </div>
        </motion.div>

        {/* Mobile preview - Only show on small screens when on appearance step or review step */}
        {(currentStep === 1 || currentStep === 2) && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 lg:hidden"
          >
            <div className="bg-gradient-to-br from-card/90 to-background border border-border/30 rounded-xl overflow-hidden shadow-sm">
              <div className="p-3 border-b border-border/10 flex justify-between items-center">
                <h2 className="font-semibold text-sm">{currentStep === 1 ? "Live Preview" : "Final Preview"}</h2>
                <span className="text-xs text-primary/80 bg-primary/5 px-2 py-1 rounded-full">
                  Tap to interact
                </span>
              </div>
              <div className="p-4 bg-gradient-to-br from-muted/20 to-transparent">
                <div className="h-[250px] relative">
                  <LivePreview data={formData} interactive={true} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/30 p-6 shadow-sm">
              <StepNavigator currentStep={currentStep} />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {getCurrentStep()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Preview Section - Only visible on larger screens */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 hidden lg:block"
          >
            <div className="lg:sticky lg:top-8 space-y-6">
              <div className="bg-gradient-to-br from-card/90 to-background border border-border/30 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-border/10">
                  <h2 className="font-semibold">{currentStep === 2 ? "Final Preview" : "Live Preview"}</h2>
                  <p className="text-sm text-muted-foreground">
                    Interactive 3D preview - Hover to interact
                  </p>
                </div>
                <div className="p-6 bg-gradient-to-br from-muted/20 to-transparent">
                  <div className="h-[300px] relative">
                    <LivePreview data={formData} interactive={true} />
                  </div>
                </div>
              </div>

              {/* Template tips - Only show on Appearance step */}
              {currentStep === 1 && (
                <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                  <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-full bg-primary/10">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    Template Tips
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    {formData.template === "modern" && (
                      <p>Modern template works best with vibrant colors that create eye-catching gradients.</p>
                    )}
                    {formData.template === "classic" && (
                      <p>Classic template features an elegant side accent with horizontal lines and a dark sophisticated background for a premium executive look.</p>
                    )}
                    {formData.template === "minimalist" && (
                      <p>Minimalist template features a distinctive corner accent and subtle geometric elements that highlight your information.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Pro tips - don't show on appearance step since we have template tips */}
              {currentStep !== 1 && (
                <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                  <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-full bg-primary/10">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    Pro Tips
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2.5">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Keep your title clear and specific to your role
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Choose colors that align with your brand identity
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Test your card preview from different angles
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {modalOpen && createdCard && (
        <CardPreviewModal
          open={modalOpen}
          onOpenChange={handleModalClose}
          card={createdCard}
          allowRedirect={true}
        />
      )}
    </div>
  );
}

// Main page component
export default function CreateCardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary/30" />
      </div>
    );
  }

  if (!session) {
    return (
      <AuthRequired
        title="Create Your Digital Business Card"
        message="Sign in to create and manage your professional digital presence."
      />
    );
  }

  return (
    <CardCreatorProvider>
      <CardCreatorContent />
    </CardCreatorProvider>
  );
}

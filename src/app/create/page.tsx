"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { LoginModal } from "@/components/LoginModal";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import QRCodeComponent from "@/components/QRCodeComponent";
import { CardPreviewModal } from "@/components/CardPreviewModal";
import {
  CardCreatorProvider,
  useCardCreator,
} from "@/components/CardCreator/CardCreatorContext";
import { StepNavigator } from "@/components/CardCreator/StepNavigator";
import { UserDetailsSection } from "@/components/CardCreator/UserDetailsSection";
import { AppearanceSection } from "@/components/CardCreator/AppearanceSection";
import { ReviewSection } from "@/components/CardCreator/ReviewSection";

// Dynamic import of LivePreview to avoid server-side rendering issues
const LivePreview = dynamic(() => import("@/components/LivePreview"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-card/30 rounded-lg">
      <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
    </div>
  ),
});

// Component for the main content when user is logged in
function CardCreatorContent() {
  const { formData, currentStep, createdCard } = useCardCreator();
  const [modalOpen, setModalOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Open modal when card is created
  useEffect(() => {
    if (createdCard) {
      setModalOpen(true);
    }
  }, [createdCard]);

  // Get current step component
  const getCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <UserDetailsSection />;
      case 1:
        return <AppearanceSection />;
      case 2:
        return <ReviewSection />;
      default:
        return <UserDetailsSection />;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-8 px-4"
      >
        {/* Header with premium styling */}
        <div className="mb-8 flex flex-col space-y-4">
          <Link
            href="/dashboard"
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors group w-fit"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card/40 backdrop-blur-sm border border-border/30 p-6 rounded-xl shadow-md"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
              Create Your Business Card
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Follow the steps below to design your professional digital
              business card.
            </p>
          </motion.div>
        </div>

        {/* Controls for mobile view */}
        <div className="lg:hidden flex mb-4 border border-border/30 rounded-lg overflow-hidden">
          <button
            className={`flex-1 py-2 text-sm font-medium ${
              !showPreview
                ? "bg-primary/10 text-primary"
                : "bg-transparent text-muted-foreground"
            }`}
            onClick={() => setShowPreview(false)}
          >
            Form Steps
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium ${
              showPreview
                ? "bg-primary/10 text-primary"
                : "bg-transparent text-muted-foreground"
            }`}
            onClick={() => setShowPreview(true)}
          >
            Preview
          </button>
        </div>

        {/* Main content - two column layout with enhanced premium look */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left column - Form steps */}
          <div
            className={`lg:col-span-7 order-2 lg:order-1 flex flex-col relative z-10 ${
              showPreview ? "hidden lg:flex" : "flex"
            }`}
          >
            <StepNavigator />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="min-h-[500px]"
              >
                {getCurrentStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right column - Preview with premium styling */}
          <div
            className={`lg:col-span-5 order-1 lg:order-2 flex flex-col space-y-8 lg:sticky top-8 self-start lg:max-h-[calc(100vh-120px)] lg:overflow-auto ${
              !showPreview ? "hidden lg:flex" : "flex"
            }`}
          >
            {/* Live preview card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card/70 backdrop-blur-sm border border-border/50 shadow-lg rounded-lg overflow-hidden relative z-0"
              whileHover={{
                translateY: -5,
                boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
              }}
            >
              <div className="p-4 border-b border-border/10 bg-gradient-to-br from-background to-muted/20">
                <h2 className="font-medium bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent">
                  Live Preview
                </h2>
                <p className="text-sm text-muted-foreground">
                  Interactive 3D preview of your card
                </p>
              </div>
              <div className="h-[350px] relative">
                <LivePreview
                  formData={{
                    ...formData,
                    name: formData.name || "Your Name",
                    title: formData.title || "Your Title",
                  }}
                />
              </div>
            </motion.div>

            {/* QR code preview with glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card/60 backdrop-blur-sm border border-border/50 shadow-lg rounded-lg overflow-hidden relative z-0"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-4 border-b border-border/10 bg-gradient-to-br from-background to-muted/20">
                <h2 className="font-medium bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent">
                  QR Code Preview
                </h2>
                <p className="text-sm text-muted-foreground">
                  Scan to view your digital card
                </p>
              </div>
              <div className="p-6 flex flex-col items-center justify-center">
                <motion.div
                  className="bg-white p-4 rounded-lg shadow-md"
                  whileHover={{ rotate: [0, -1, 1, -1, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <QRCodeComponent
                    url={
                      createdCard?.id
                        ? `${window.location.origin}/card/${createdCard.id}`
                        : `${window.location.origin}/preview`
                    }
                    size={150}
                  />
                </motion.div>
                <p className="text-xs text-muted-foreground text-center mt-4 px-4">
                  {currentStep < 2
                    ? "Complete all steps to generate your QR code"
                    : createdCard
                    ? "Scan this QR code to view your card"
                    : "Click Create Card to generate your final QR code"}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Card Preview Modal */}
      {modalOpen && createdCard && (
        <CardPreviewModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          card={createdCard}
        />
      )}
    </>
  );
}

// Main page component
export default function CreateCardPage() {
  const { data: session, status } = useSession();

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!session) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-b from-gradient-start to-gradient-end rounded-xl p-8 shadow-lg border border-glass-border backdrop-blur-sm max-w-md w-full text-center"
        >
          <h2 className="text-2xl font-bold mb-3">
            Create Your Digital Business Card
          </h2>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to create and manage your business cards.
          </p>
          <LoginModal />
        </motion.div>
      </div>
    );
  }

  // Render main content with CardCreatorProvider
  return (
    <CardCreatorProvider>
      <CardCreatorContent />
    </CardCreatorProvider>
  );
}

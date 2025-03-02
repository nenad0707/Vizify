"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { LoginModal } from "@/components/LoginModal";
import { ArrowLeft, Loader2, Palette, QrCode } from "lucide-react";
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

function CardCreatorContent() {
  const { formData, currentStep, createdCard } = useCardCreator();
  const [modalOpen, setModalOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  // Open modal when card is created
  useEffect(() => {
    if (createdCard) {
      setModalOpen(true);
    }
  }, [createdCard]);

  const handleModalClose = (redirected = false) => {
    if (!redirected) {
      setModalOpen(false);
    }
  };

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
        className="container mx-auto py-4 px-3 relative"
      >
        <div className="mb-4 flex flex-col space-y-3">
          {" "}
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
            className="bg-card/40 backdrop-blur-sm border border-border/30 p-4 rounded-lg shadow-md"
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-1">
              {" "}
              Create Your Business Card
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              {" "}
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {" "}
          <div
            className={`lg:col-span-7 order-2 lg:order-1 flex flex-col relative ${
              showPreview ? "hidden lg:flex" : "flex"
            }`}
            style={{ zIndex: 100 }}
          >
            <StepNavigator compact={true} />

            <div className="relative mt-2">
              {" "}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="relative"
                  style={{ zIndex: 100 }}
                >
                  {getCurrentStep()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div
            className={`lg:col-span-5 order-1 lg:order-2 flex flex-col space-y-4 lg:pl-2 ${
              !showPreview ? "hidden lg:flex" : "flex"
            }`}
          >
            <div
              className="lg:sticky lg:top-20 space-y-4 flex flex-col items-center lg:items-end"
              style={{ zIndex: 10 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-card to-card/70 border border-border/40 shadow-lg rounded-lg overflow-hidden w-full lg:max-w-[95%]"
              >
                <div className="p-3 border-b border-border/10 bg-gradient-to-r from-background/80 to-muted/5">
                  <h2 className="text-sm font-medium bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent flex items-center gap-1.5">
                    <Palette className="h-3.5 w-3.5 text-primary/70" />
                    Live Preview
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Interactive 3D business card preview
                  </p>
                </div>
                <div
                  className={`relative p-4 bg-background/20 ${
                    isMobile ? "h-[240px]" : "h-[280px]"
                  }`}
                >
                  <LivePreview
                    formData={{
                      ...formData,
                      name: formData.name || "Your Name",
                      title: formData.title || "Your Title",
                    }}
                    isMobile={isMobile}
                  />
                </div>
              </motion.div>

              {/* QR code preview with matching styles */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card border border-border/40 shadow-md rounded-lg overflow-hidden w-full lg:max-w-[95%]"
              >
                <div className="p-2 border-b border-border/10 bg-gradient-to-r from-background/80 to-muted/5">
                  <h2 className="text-sm font-medium bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent flex items-center gap-1">
                    <QrCode className="h-3.5 w-3.5 text-primary/70" />
                    QR Code
                  </h2>
                </div>
                <div className="py-4 px-3 flex flex-col items-center justify-center bg-background/30">
                  <motion.div
                    className="bg-white p-1.5 rounded-md shadow-sm"
                    whileHover={{ rotate: [0, -1, 1, -1, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <QRCodeComponent
                      url={
                        createdCard?.id
                          ? `${window.location.origin}/card/${createdCard.id}`
                          : `${window.location.origin}/preview`
                      }
                      size={110}
                    />
                  </motion.div>
                  <p className="text-xs text-muted-foreground text-center mt-3 px-2 max-w-[200px]">
                    {createdCard
                      ? "Scan to view your card"
                      : currentStep < 2
                      ? "Complete all steps"
                      : "Create your card"}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {modalOpen && createdCard && (
        <CardPreviewModal
          open={modalOpen}
          onOpenChange={handleModalClose}
          card={createdCard}
          allowRedirect={true}
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

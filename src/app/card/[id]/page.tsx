"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Loader2, ArrowLeft, Share2, Edit, QrCode, 
  ExternalLink, User, Trash2, Briefcase, 
  Palette, Calendar, Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import QRCodeComponent from "@/components/QRCodeComponent";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DeleteDialog } from "@/components/DeleteDialog";
import { EditCardModal } from "@/components/EditCardModal";
import { toPng } from "html-to-image";
import { LivePreview } from "@/components/LivePreview";

// Card data interface
interface CardData {
  id: string;
  name: string;
  title: string;
  color: string;
  template: string;
  email?: string;
  phone?: string;
  company?: string;
  createdAt: string;
  qrCode?: string;
}

export default function CardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const businessCardRef = useRef<HTMLDivElement>(null);
  
  // State management
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch card data
  useEffect(() => {
    async function fetchCard() {
      try {
        setLoading(true);
        const res = await fetch(`/api/cards/${id}`);

        if (res.status === 404) {
          setError("Card not found");
          return;
        }

        if (res.status === 401 || res.status === 403) {
          const publicRes = await fetch(`/api/public-cards/${id}`);
          if (publicRes.ok) {
            setCard(await publicRes.json());
            setIsOwner(false);
          } else {
            if (res.status === 401) router.push("/login");
            else setError("You don't have permission to view this card");
          }
          return;
        }

        if (res.ok) {
          setCard(await res.json());
          setIsOwner(true);
        } else {
          throw new Error("Failed to fetch card");
        }
      } catch (error) {
        console.error("Error fetching card:", error);
        setError("There was a problem loading the card.");
      } finally {
        setLoading(false);
      }
    }

    fetchCard();
  }, [id, router]);

  // Card URL for sharing
  const cardUrl = card ? `${window.location.origin}/card/${id}` : '';

  // Handle actions
  const handleShare = () => {
    navigator.clipboard.writeText(cardUrl);
    toast.success("Card URL copied to clipboard!");
  };

  const handleDownloadCard = async () => {
    if (!businessCardRef.current || !card) return;
    
    toast.info("Preparing image for download...");
    try {
      const dataUrl = await toPng(businessCardRef.current, {
        pixelRatio: 3,
        backgroundColor: 'transparent',
        style: { transform: 'none' }
      });
      
      const link = document.createElement("a");
      link.download = `${card.name.replace(/\s+/g, "-")}-business-card.png`;
      link.href = dataUrl;
      link.click();
      
      toast.success("Business card downloaded successfully!");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to download business card");
    }
  };

  const refreshCard = async () => {
    try {
      const res = await fetch(`/api/cards/${id}`);
      if (res.ok) {
        setCard(await res.json());
      } else if (res.status === 404) {
        toast.info("Card has been deleted");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error refreshing card:", error);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center h-16 w-16">
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
            />
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <p className="text-muted-foreground">Loading card details...</p>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="container max-w-md mx-auto px-4 py-16">
        <motion.div
          className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-background/80 flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold">Card Not Found</h2>
            <p className="text-muted-foreground mt-2">
              The business card you're looking for doesn't exist or has been removed.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
        </motion.div>
      </div>
    );
  }
  
  // Return null if card data isn't available
  if (!card) return null;

  return (
    <div className="min-h-screen">
      {/* Header bar */}
      <div className="bg-background/80 backdrop-blur-sm border-b border-border/10 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center">
          {isOwner && (
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Dashboard</span>
            </Link>
          )}

          <div className="ml-auto flex gap-2">
            {isOwner && (
              <>
                <Button size="sm" variant="outline" onClick={() => setIsEditModalOpen(true)}>
                  <Edit className="mr-2 h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="border-destructive/30 hover:border-destructive/60 hover:bg-destructive/5"
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Main card content */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-card to-card/60 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg overflow-hidden"
          >
            {/* Card and Info section */}
            <div className="p-5 sm:p-8 flex flex-col md:flex-row md:items-center gap-8">
              {/* Card preview */}
              <div className="relative flex-1">
                <div className="perspective-1000 max-w-[350px] mx-auto md:mx-0">
                  <LivePreview
                    ref={businessCardRef}
                    data={card}
                    interactive={true}
                    className="rounded-xl"
                  />
                </div>

                {/* Background effects */}
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%]">
                  <div
                    className="absolute top-0 left-10 w-40 h-40 rounded-full blur-3xl opacity-20"
                    style={{ background: `radial-gradient(circle at center, ${card.color}80, transparent 70%)` }}
                  />
                  <div
                    className="absolute bottom-10 right-0 w-32 h-32 rounded-full blur-3xl opacity-10"
                    style={{ background: `radial-gradient(circle at center, ${card.color}60, transparent 70%)` }}
                  />
                </div>
              </div>

              {/* Card Info section */}
              <div className="flex-1 max-w-md">
                <h1 className="text-3xl font-bold text-foreground mb-2">{card.name}</h1>
                <p className="text-xl text-muted-foreground mb-6">{card.title}</p>

                <div className="space-y-4 mb-6">
                  {/* Color info */}
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-md flex items-center justify-center bg-primary/10">
                      <Palette className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Brand Color</span>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full border border-border" style={{ backgroundColor: card.color }} />
                        <span className="text-sm font-medium">{card.color}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Company info (if available) */}
                  {card.company && (
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-md flex items-center justify-center bg-primary/10">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">Company</span>
                        <span className="text-sm font-medium">{card.company}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Created date info */}
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-md flex items-center justify-center bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Created</span>
                      <span className="text-sm font-medium">{new Date(card.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-8">
                  <Button onClick={handleShare} className="flex-1" variant="default">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Card
                  </Button>

                  <Button onClick={handleDownloadCard} variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download Image
                  </Button>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-muted/30 border-t border-border/30 p-5 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                {/* QR Code */}
                <div className="flex-shrink-0">
                  <div className="bg-white p-3 rounded-lg shadow-md">
                    <QRCodeComponent url={cardUrl} size={150} />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <QrCode className="h-4 w-4" />
                    Scan to View
                  </h3>
                  <p className="text-muted-foreground max-w-md text-sm">
                    Scan this QR code with a smartphone camera to instantly view
                    this digital business card. Share it in emails, presentations, or print it on physical materials.
                  </p>
                </div>

                {/* URL sharing */}
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Or share this link:</p>
                  <div className="flex items-center gap-2">
                    <div className="bg-background/80 border border-border/60 rounded-md px-3 py-1.5 text-xs text-foreground/80 overflow-hidden text-ellipsis max-w-[220px] sm:max-w-xs">
                      {cardUrl}
                    </div>
                    <Button size="sm" variant="outline" className="h-8" onClick={handleShare}>
                      <Share2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Call to action for non-owners */}
        {!isOwner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20 p-6 text-center"
          >
            <h2 className="text-xl font-semibold mb-2">Create your own digital business card</h2>
            <p className="text-muted-foreground mb-4">
              Join Vizify and create professional digital business cards that stand out.
            </p>
            <Button asChild size="lg">
              <Link href="/create">
                Get Started
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>

      {/* Dialogs */}
      {isDeleteDialogOpen && (
        <DeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={(open) => {
            setIsDeleteDialogOpen(open);
            if (!open) router.push("/dashboard");
          }}
          cardId={id}
          cardName={card.name}
          onDelete={() => {
            toast.success("Card deleted successfully");
            router.push("/dashboard");
          }}
        />
      )}

      {isEditModalOpen && (
        <EditCardModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          card={{ ...card, template: card.template || "modern" }}
          onUpdate={refreshCard}
        />
      )}
    </div>
  );
}

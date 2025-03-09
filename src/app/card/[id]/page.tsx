"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Loader2,
  ArrowLeft,
  Share2,
  Edit,
  QrCode,
  ExternalLink,
  User,
  Trash2,
  Briefcase,
  Palette,
  Calendar,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import QRCodeComponent from "@/components/QRCodeComponent";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DeleteDialog } from "@/components/DeleteDialog";
import { EditCardModal } from "@/components/EditCardModal";
import * as htmlToImage from "html-to-image";
import { toPng } from "html-to-image";
import { LivePreview } from "@/components/LivePreview";
import dynamic from "next/dynamic";

// Dinamički učitaj 3D komponentu bez SSR
// const Card3DPreview = dynamic(() => import("@/components/Card3DPreview"), {
//   ssr: false,
//   loading: () => (
//     <div className="w-full h-full aspect-[1.6/1] bg-muted/30 animate-pulse rounded-lg flex items-center justify-center">
//       <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
//     </div>
//   ),
// });

interface CardPageProps {
  params: Promise<{ id: string }>;
}

interface CardData {
  id: string;
  name: string;
  title: string;
  color: string;
  template: string; // Changed from optional to required
  email?: string;
  phone?: string;
  company?: string;
  createdAt: string;
  qrCode?: string;
}

export default function CardPage({ params }: CardPageProps) {
  const { id } = use(params);

  const router = useRouter();
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Reference to the business card component for image capture
  const businessCardRef = useRef<HTMLDivElement>(null);

  // Function to get border radius based on template
  const getBorderRadius = (template: string): string => {
    switch (template) {
      case "modern":
        return "0.75rem";
      case "minimalist":
        return "0.5rem";
      case "classic":
        return "0.25rem";
      default:
        return "0.75rem"; // Default to modern
    }
  };

  // Function to get card styles based on template
  const getCardStyles = (template: string, color: string) => {
    const borderRadius = getBorderRadius(template);

    switch (template) {
      case "modern":
        return {
          backgroundColor: color,
          borderRadius,
          boxShadow:
            "0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
          padding: "1.5rem",
          textColor: "#ffffff",
          textColorSecondary: "rgba(255,255,255,0.9)",
        };
      case "classic":
        return {
          backgroundColor: color,
          borderRadius,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          padding: "1.5rem",
          textColor: "#000000",
          textColorSecondary: "rgba(0,0,0,0.7)",
        };
      case "minimalist":
        return {
          backgroundColor: color,
          borderRadius,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          padding: "1.5rem",
          textColor: "#000000",
          textColorSecondary: "rgba(0,0,0,0.7)",
        };
      default:
        return {
          backgroundColor: color,
          borderRadius: "0.75rem",
          boxShadow:
            "0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
          padding: "1.5rem",
          textColor: "#ffffff",
          textColorSecondary: "rgba(255,255,255,0.9)",
        };
    }
  };

  useEffect(() => {
    const fetchCard = async () => {
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
            const data = await publicRes.json();
            setCard(data);
            setIsOwner(false);
            return;
          } else {
            if (res.status === 401) {
              router.push("/login");
            } else {
              setError("You don't have permission to view this card");
            }
            return;
          }
        }

        if (res.ok) {
          const data = await res.json();
          setCard(data);
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
    };

    fetchCard();
  }, [id, router]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const handleShare = () => {
    const cardUrl = `${window.location.origin}/card/${id}`;
    navigator.clipboard.writeText(cardUrl);
    toast.success("Card URL copied to clipboard!");
  };

  // Improved function to download the business card with proper rounded corners
  const handleDownloadCard = async () => {
    if (!businessCardRef.current || !card) return;

    toast.info("Preparing image for download...");

    try {
      // Set options with filter to ensure the rounded corners get captured
      const options = {
        pixelRatio: 3,
        backgroundColor: card.color,
        style: {
          borderRadius: getBorderRadius(card.template || "modern"), // Use the same function for consistency
          overflow: "hidden", // Ensure content is clipped to the border-radius
        },
        filter: (node: HTMLElement) => {
          // Make sure we capture everything inside the card (including pseudo-elements that may create rounded corners)
          return true;
        },
        onCloneNode: (node: HTMLElement) => {
          // Preserve border radius on cloned nodes
          if (
            node instanceof HTMLElement &&
            node.classList?.contains("business-card")
          ) {
            node.style.borderRadius = getBorderRadius(
              card.template || "modern",
            );
          }
          return node;
        },
      };

      // Use toPng for better quality
      const dataUrl = await toPng(businessCardRef.current, options);

      // Create a canvas to add a border radius to the final image
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          // Fallback if canvas context not available
          downloadImage(dataUrl);
          return;
        }

        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw rounded rectangle
        ctx.beginPath();
        const radius =
          parseInt(getBorderRadius(card.template || "modern")) *
          (img.width / 350); // Adjust radius based on template
        ctx.moveTo(radius, 0);
        ctx.lineTo(canvas.width - radius, 0);
        ctx.arcTo(canvas.width, 0, canvas.width, radius, radius);
        ctx.lineTo(canvas.width, canvas.height - radius);
        ctx.arcTo(
          canvas.width,
          canvas.height,
          canvas.width - radius,
          canvas.height,
          radius,
        );
        ctx.lineTo(radius, canvas.height);
        ctx.arcTo(0, canvas.height, 0, canvas.height - radius, radius);
        ctx.lineTo(0, radius);
        ctx.arcTo(0, 0, radius, 0, radius);
        ctx.closePath();

        // Create clipping path and draw image
        ctx.clip();
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Get the rounded image as data URL and download
        const roundedImageDataUrl = canvas.toDataURL("image/png");
        downloadImage(roundedImageDataUrl);
      };

      // Load the captured image
      img.src = dataUrl;

      // Helper function to download the image
      function downloadImage(url: string) {
        const link = document.createElement("a");
        // Safe access to card using non-null assertion since we've checked it at the function start
        link.download = `${card!.name.replace(/\s+/g, "-")}-business-card.png`;
        link.href = url;
        link.click();
        toast.success("Business card downloaded successfully!");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to download business card");
    }
  };

  const refreshCard = async () => {
    try {
      const res = await fetch(`/api/cards/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCard(data);
      } else if (res.status === 404) {
        toast.info("Card has been deleted");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error refreshing card:", error);
    }
  };

  const handleDeleteComplete = () => {
    toast.success("Card deleted successfully");
    router.push("/dashboard");
  };

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
              The business card you're looking for doesn't exist or has been
              removed.
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

  if (!card) {
    return null;
  }

  const cardUrl = `${window.location.origin}/card/${id}`;

  return (
    <div className="min-h-screen">
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(true)}
                >
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
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-card to-card/60 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg overflow-hidden"
          >
            <div className="p-5 sm:p-8 flex flex-col md:flex-row md:items-center gap-8">
              <div className="relative flex-1" onMouseMove={handleMouseMove}>
                <div className="perspective-1000 max-w-[350px] mx-auto md:mx-0">
                  {/* Zamenili smo Card3DPreview sa LivePreview */}
                  <LivePreview
                    ref={businessCardRef}
                    data={card}
                    interactive={true}
                    className="rounded-xl"
                  />
                </div>

                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%]">
                  <div
                    className="absolute top-0 left-10 w-40 h-40 rounded-full blur-3xl opacity-20"
                    style={{
                      background: `radial-gradient(circle at center, ${card.color}80, transparent 70%)`,
                    }}
                  />
                  <div
                    className="absolute bottom-10 right-0 w-32 h-32 rounded-full blur-3xl opacity-10"
                    style={{
                      background: `radial-gradient(circle at center, ${card.color}60, transparent 70%)`,
                    }}
                  />
                </div>
              </div>

              {/* Card Info section */}
              <div className="flex-1 max-w-md">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {card.name}
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                  {card.title}
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-md flex items-center justify-center bg-primary/10">
                      <Palette className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">
                        Brand Color
                      </span>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-4 w-4 rounded-full border border-border"
                          style={{ backgroundColor: card.color }}
                        />
                        <span className="text-sm font-medium">
                          {card.color}
                        </span>
                      </div>
                    </div>
                  </div>

                  {card.company && (
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-md flex items-center justify-center bg-primary/10">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">
                          Company
                        </span>
                        <span className="text-sm font-medium">
                          {card.company}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-md flex items-center justify-center bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">
                        Created
                      </span>
                      <span className="text-sm font-medium">
                        {new Date(card.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-8">
                  <Button
                    onClick={handleShare}
                    className="flex-1"
                    variant="default"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Card
                  </Button>

                  <Button
                    onClick={handleDownloadCard}
                    variant="outline"
                    className="flex-1"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Image
                  </Button>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-muted/30 border-t border-border/30 p-5 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="bg-white p-3 rounded-lg shadow-md">
                    <QRCodeComponent url={cardUrl} size={150} />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <QrCode className="h-4 w-4" />
                    Scan to View
                  </h3>
                  <p className="text-muted-foreground max-w-md text-sm">
                    Scan this QR code with a smartphone camera to instantly view
                    this digital business card. Share it in emails,
                    presentations, or print it on physical materials.
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Or share this link:
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="bg-background/80 border border-border/60 rounded-md px-3 py-1.5 text-xs text-foreground/80 overflow-hidden text-ellipsis max-w-[220px] sm:max-w-xs">
                      {cardUrl}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8"
                      onClick={handleShare}
                    >
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
            <h2 className="text-xl font-semibold mb-2">
              Create your own digital business card
            </h2>
            <p className="text-muted-foreground mb-4">
              Join Vizify and create professional digital business cards that
              stand out.
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

      {isDeleteDialogOpen && (
        <DeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={(open) => {
            setIsDeleteDialogOpen(open);
            // If dialog is closing and we successfully deleted the card, redirect
            if (!open) {
              router.push("/dashboard");
            }
          }}
          cardId={id}
          cardName={card.name}
          onDelete={handleDeleteComplete}
        />
      )}

      {isEditModalOpen && card && (
        <EditCardModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          card={{
            ...card,
            template: card.template || "modern", // Ensure the template is never undefined
          }}
          onUpdate={refreshCard}
        />
      )}
    </div>
  );
}

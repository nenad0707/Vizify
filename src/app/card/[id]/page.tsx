"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
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
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import QRCodeComponent from "@/components/QRCodeComponent";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DeleteDialog } from "@/components/DeleteDialog";
import { EditCardModal } from "@/components/EditCardModal";

interface CardPageProps {
  params: Promise<{ id: string }>;
}

interface CardData {
  id: string;
  name: string;
  title: string;
  color: string;
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
                  <motion.div
                    className="business-card premium-3d-card w-full aspect-[1.7/1] rounded-xl overflow-hidden relative"
                    whileHover={{
                      rotateX: [0, -5, 0],
                      rotateY: [0, 10, 0],
                      transition: { duration: 0.5 },
                    }}
                    style={{
                      backgroundColor: card.color,
                      boxShadow: "0 35px 60px -15px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
                      style={{
                        transform: `translate(${mousePosition.x / 10}px, ${
                          mousePosition.y / 10
                        }px)`,
                        background:
                          "linear-gradient(105deg, transparent 20%, rgba(255, 255, 255, 0.25) 40%, rgba(255, 255, 255, 0.1) 60%, transparent 80%)",
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />

                    <div className="p-6 flex flex-col justify-between h-full relative">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white text-xl font-bold drop-shadow-sm">
                            {card.name}
                          </h3>
                          <p className="text-white/90 text-sm mt-1">
                            {card.title}
                          </p>
                        </div>

                        <div className="h-12 w-12 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm text-white font-bold text-lg shadow-md">
                          {card.name.charAt(0)}
                        </div>
                      </div>

                      <div>
                        {card.company && (
                          <p className="text-white/80 text-xs mb-1">
                            {card.company}
                          </p>
                        )}
                        {card.email && (
                          <p className="text-white/90 text-xs font-medium">
                            {card.email}
                          </p>
                        )}
                        {card.phone && (
                          <p className="text-white/90 text-xs font-medium">
                            {card.phone}
                          </p>
                        )}
                      </div>

                      <div className="absolute bottom-4 right-4 space-x-1 flex">
                        <div className="h-1.5 w-8 bg-white/20 rounded-full" />
                        <div className="h-1.5 w-5 bg-white/20 rounded-full" />
                        <div className="h-1.5 w-3 bg-white/20 rounded-full" />
                      </div>
                    </div>
                  </motion.div>
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

              {/* Card Info */}
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
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: card.color }}
                        />
                        <code className="text-sm">{card.color}</code>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-md flex items-center justify-center bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">
                        Created On
                      </span>
                      <span>
                        {new Date(card.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <Button onClick={handleShare} className="flex-1">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Card
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      document
                        .getElementById("qr-section")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="flex-1"
                  >
                    <QrCode className="mr-2 h-4 w-4" />
                    View QR Code
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div
          id="qr-section"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg overflow-hidden h-full"
          >
            <div className="p-4 border-b border-border/10 bg-gradient-to-r from-background/80 to-muted/5">
              <h2 className="text-lg font-medium flex items-center">
                <QrCode className="h-5 w-5 text-primary/70 mr-2" />
                Scan & Share
              </h2>
            </div>

            <div className="p-6 flex flex-col items-center h-full justify-center">
              <motion.div
                className="bg-white p-4 rounded-lg shadow-sm"
                whileHover={{ scale: 1.02, rotate: 0.5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <QRCodeComponent url={cardUrl} size={180} />
              </motion.div>

              <p className="text-sm text-muted-foreground text-center mt-6 mb-4">
                Scan with your phone camera to instantly access this business
                card on any device
              </p>

              <div className="w-full bg-background/40 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Card URL:</p>
                <div className="flex items-center">
                  <code className="text-xs bg-background/80 flex-1 p-2 rounded truncate mr-1">
                    {cardUrl}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={handleShare}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg overflow-hidden h-full"
          >
            <div className="p-4 border-b border-border/10 bg-gradient-to-r from-background/80 to-muted/5">
              <h2 className="text-lg font-medium flex items-center">
                <span className="inline-block w-1 h-5 bg-primary/90 rounded-sm mr-2"></span>
                Get the Most out of Your Card
              </h2>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3 rounded-lg bg-background/40 hover:bg-background/60 transition-colors border border-transparent hover:border-border/20">
                <h3 className="font-medium mb-1 flex items-center">
                  <Share2 className="h-4 w-4 mr-2 text-primary/70" />
                  Share across platforms
                </h3>
                <p className="text-sm text-muted-foreground">
                  Send your digital card via email, SMS, or social media with a
                  simple link
                </p>
              </div>

              <div className="p-3 rounded-lg bg-background/40 hover:bg-background/60 transition-colors border border-transparent hover:border-border/20">
                <h3 className="font-medium mb-1 flex items-center">
                  <QrCode className="h-4 w-4 mr-2 text-primary/70" />
                  Print QR for events
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add your QR code to physical materials for networking at
                  events
                </p>
              </div>

              <div className="p-3 rounded-lg bg-background/40 hover:bg-background/60 transition-colors border border-transparent hover:border-border/20">
                <h3 className="font-medium mb-1 flex items-center">
                  <Edit className="h-4 w-4 mr-2 text-primary/70" />
                  Keep information current
                </h3>
                <p className="text-sm text-muted-foreground">
                  Update your card anytime and changes are instantly available
                  everywhere
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {card && (
        <>
          <DeleteDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            cardName={card.name}
            cardId={id}
            onDelete={handleDeleteComplete}
          />

          <EditCardModal
            open={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            card={{
              id: card.id,
              name: card.name,
              title: card.title,
              color: card.color,
              email: card.email || "",
              phone: card.phone || "",
              company: card.company || "",
              createdAt: card.createdAt,
              qrCode: card.qrCode || "",
            }}
            onUpdate={refreshCard}
          />
        </>
      )}
    </div>
  );
}

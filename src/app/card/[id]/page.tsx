"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Loader2,
  ArrowLeft,
  Share2,
  Download,
  Edit,
  QrCode,
  ExternalLink,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import QRCodeComponent from "@/components/QRCodeComponent";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CardPageProps {
  params: { id: string };
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
  const router = useRouter();
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchCard = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/cards/${params.id}`);

        if (res.status === 404) {
          setError("Card not found");
          return;
        }

        if (res.status === 401) {
          const publicRes = await fetch(`/api/public-cards/${params.id}`);
          if (publicRes.ok) {
            const data = await publicRes.json();
            setCard(data);
            setIsOwner(false);
            return;
          }
          router.push("/login");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch card");
        }

        const data = await res.json();
        setCard(data);
        setIsOwner(true);
      } catch (error) {
        console.error("Error fetching card:", error);
        setError("There was a problem loading the card.");
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [params.id, router]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const handleShare = () => {
    const cardUrl = `${window.location.origin}/card/${params.id}`;
    navigator.clipboard.writeText(cardUrl);
    toast.success("Card URL copied to clipboard!");
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

  const cardUrl = `${window.location.origin}/card/${params.id}`;

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="container mx-auto max-w-5xl">
        {isOwner && (
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-6 bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg"
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {isOwner ? "Your Business Card" : card.name}
              </h1>
              <p className="text-muted-foreground mb-6">
                {isOwner
                  ? "This is how your card appears to others"
                  : card.title}
              </p>

              <div className="relative mb-8" onMouseMove={handleMouseMove}>
                <div
                  className="perspective-1000 mx-auto"
                  style={{ maxWidth: "350px" }}
                >
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

              <div className="flex flex-wrap justify-center gap-3">
                {isOwner && (
                  <Button variant="outline" asChild>
                    <Link href={`/edit/${params.id}`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Card
                    </Link>
                  </Button>
                )}

                <Button onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Card
                </Button>

                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download vCard
                </Button>
              </div>
            </motion.div>

            {isOwner && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border/40 shadow-md space-y-4"
              >
                <h2 className="text-lg font-medium flex items-center">
                  <span className="inline-block w-2 h-6 bg-primary/90 rounded-sm mr-2"></span>
                  Card Usage
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-3 bg-background/40 rounded-lg space-y-1">
                    <p className="text-xs text-muted-foreground">Impressions</p>
                    <p className="text-xl font-bold">128</p>
                  </div>
                  <div className="p-3 bg-background/40 rounded-lg space-y-1">
                    <p className="text-xs text-muted-foreground">Scans</p>
                    <p className="text-xl font-bold">32</p>
                  </div>
                  <div className="p-3 bg-background/40 rounded-lg space-y-1">
                    <p className="text-xs text-muted-foreground">Shares</p>
                    <p className="text-xl font-bold">8</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg"
            >
              <div className="flex items-center mb-4">
                <QrCode className="h-5 w-5 text-primary mr-2" />
                <h2 className="text-lg font-medium">QR Code</h2>
              </div>

              <p className="text-sm text-muted-foreground mb-5">
                Scan this code to access this business card on any device, or
                share it with your network.
              </p>

              <motion.div
                className="bg-white p-4 rounded-lg shadow-sm mx-auto w-fit"
                whileHover={{ scale: 1.02, rotate: 0.5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <QRCodeComponent url={cardUrl} size={180} />
              </motion.div>

              <div className="mt-4 w-full bg-background/40 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">
                  Direct URL:
                </p>
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg"
            >
              <h2 className="text-lg font-medium mb-4">Card Details</h2>

              <div className="space-y-4">
                <div className="p-3 bg-background/40 rounded-lg flex flex-col">
                  <span className="text-xs text-muted-foreground">Name</span>
                  <span className="font-medium">{card.name}</span>
                </div>
                <div className="p-3 bg-background/40 rounded-lg flex flex-col">
                  <span className="text-xs text-muted-foreground">Title</span>
                  <span className="font-medium">{card.title}</span>
                </div>
                <div className="p-3 bg-background/40 rounded-lg flex flex-col">
                  <span className="text-xs text-muted-foreground">Color</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-full"
                      style={{ backgroundColor: card.color }}
                    />
                    <code className="text-xs">{card.color}</code>
                  </div>
                </div>
                <div className="p-3 bg-background/40 rounded-lg flex flex-col">
                  <span className="text-xs text-muted-foreground">Created</span>
                  <span className="font-medium">
                    {new Date(card.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {isOwner && (
                <div className="mt-6 pt-6 border-t border-border/30">
                  <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                    Owner Actions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="destructive" size="sm">
                      Delete Card
                    </Button>
                    <Button variant="outline" size="sm">
                      View Analytics
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useCallback, useEffect, memo, useRef } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Share2, Star, Eye, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QuickActions } from "./QuickActions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";
import { BusinessCard } from "@/types";

interface GridViewProps {
  cards: BusinessCard[];
  loading?: boolean;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  onCardClick?: (card: BusinessCard) => void;
  onShare?: (card: BusinessCard) => void;
  onEdit?: (card: BusinessCard) => void;
  onDelete?: (card: BusinessCard) => void;
}

const CardItem = memo(
  ({
    card,
    index,
    onCardClick,
    onShare,
    onEdit,
    onDelete,
  }: {
    card: BusinessCard;
    index: number;
    onCardClick?: (card: BusinessCard) => void;
    onShare?: (card: BusinessCard) => void;
    onEdit?: (card: BusinessCard) => void;
    onDelete?: (card: BusinessCard) => void;
  }) => {
    // Refs & State
    const [element, setElement] = useState<HTMLElement | null>(null);
    const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });

    // Combine refs
    const refCallback = useCallback(
      (node: HTMLDivElement | null) => {
        setElement(node);
        ref(node);
      },
      [ref],
    );

    const [isExpanded, setIsExpanded] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const router = useRouter();
    const [isHovering, setIsHovering] = useState(false);

    const handleCardClick = useCallback(() => {
      if (onCardClick) {
        onCardClick(card);
      } else {
        router.push(`/card/${card.id}`);
      }
    }, [card, onCardClick, router]);

    const handleShareClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onShare) {
          onShare(card);
        }
      },
      [card, onShare],
    );

    const toggleExpand = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      setIsExpanded((prev) => !prev);
    }, []);

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!element) return;

        const rect = element.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      },
      [element],
    );

    const initials = card.name
      .split(" ")
      .map((name) => name[0])
      .join("");

    const gradientPosition = `${mousePosition.x}px ${mousePosition.y}px`;

    const getInitialsBackground = useCallback(() => {
      // Simple implementation for darkening color
      const darkenColor = (color: string) => {
        return color;
      };

      const darkerColor = darkenColor(card.color);

      return {
        background: `linear-gradient(135deg, ${card.color}, ${darkerColor})`,
      };
    }, [card.color]);

    // Enhanced animations for premium feel
    const cardVariants = {
      hidden: { opacity: 0, y: 30 },
      visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: i * 0.05,
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1], // Custom easing for smoother motion
        },
      }),
      hover: {
        y: -8,
        boxShadow:
          "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20,
        },
      },
    };

    return (
      <motion.div
        ref={refCallback}
        custom={index}
        variants={cardVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        whileHover="hover"
        onClick={handleCardClick}
        className="h-full"
      >
        <Card
          className={`overflow-hidden bg-card/70 backdrop-blur-sm border-border/50 hover:border-border transition-all shadow-md ${
            isHovering ? "shadow-lg ring-1 ring-primary/20" : ""
          } group h-full flex flex-col cursor-pointer`}
          style={{
            transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          tabIndex={0}
          role="article"
          aria-labelledby={`card-title-${card.id}`}
          onMouseMove={handleMouseMove}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleCardClick();
            }
          }}
        >
          <motion.div
            className="h-2 w-full"
            style={{ backgroundColor: card.color }}
            animate={{
              height: isHovering ? "4px" : "2px",
            }}
          />

          <CardHeader className="pb-2 relative">
            <div className="flex items-center justify-between">
              <CardTitle
                id={`card-title-${card.id}`}
                className="text-lg font-semibold"
              >
                {card.name}
              </CardTitle>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {card.title}
            </p>

            {card.company && (
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {card.company}
              </p>
            )}
          </CardHeader>

          <CardContent className="flex-grow">
            <div
              className="h-28 w-full rounded-lg shadow-inner flex items-center justify-center relative overflow-hidden mb-3 transition-all transform-gpu"
              style={{
                backgroundColor: card.color,
                transform: isHovering ? "scale(1.03)" : "scale(1)",
                transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <div
                className="text-white font-bold text-xl relative flex items-center justify-center w-16 h-16 rounded-full overflow-hidden"
                style={getInitialsBackground()}
              >
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <span className="relative z-10">{initials}</span>

                <div className="absolute bottom-0 right-0 w-full h-1/3 bg-white opacity-10 transform rotate-45 translate-y-1/2 translate-x-1/2"></div>
              </div>

              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80 flex flex-col items-center justify-center p-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovering ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Eye className="h-4 w-4 text-white/90 mb-1.5" />
                <p className="text-sm text-white/90 font-medium text-center">
                  View details
                </p>

                {card.company && (
                  <p className="text-xs text-white/70 mt-1">{card.company}</p>
                )}
              </motion.div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  Created {new Date(card.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between pt-2 border-t border-border/40 mt-auto">
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className="h-6 bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                      onClick={handleShareClick}
                    >
                      <Share2 className="h-3 w-3 mr-1" /> Share
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>Share this card</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={toggleExpand}
                      className="h-6 w-6 rounded-full flex items-center justify-center bg-muted/50 hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label={isExpanded ? "Show less" : "Show more"}
                    >
                      <Info className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isExpanded ? "Show less" : "Show more details"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <QuickActions card={card} onEdit={onEdit} onDelete={onDelete} />
            </div>

            {card.createdAt && (
              <div className="flex items-center text-xs text-muted-foreground ml-auto">
                <CalendarDays className="h-3 w-3 mr-1" />
                {new Date(card.createdAt || "").toLocaleDateString()}
              </div>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    );
  },
);

CardItem.displayName = "CardItem";

const CardSkeleton = ({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
  >
    <Card className="overflow-hidden border-border/30 h-full">
      <div className="h-2 w-full bg-muted/60"></div>
      <CardHeader className="pb-2">
        <div className="h-6 w-3/4 bg-muted/60 rounded"></div>
        <div className="h-4 w-1/2 bg-muted/40 rounded mt-2"></div>
      </CardHeader>
      <CardContent>
        <div className="h-28 w-full rounded-lg bg-muted/60 mb-3"></div>
        <div className="h-3 w-3/4 bg-muted/40 rounded"></div>
      </CardContent>
      <CardFooter className="pt-2 border-t border-border/20 flex justify-between">
        <div className="h-6 w-16 bg-muted/40 rounded"></div>
        <div className="h-6 w-16 bg-muted/40 rounded"></div>
      </CardFooter>
    </Card>
  </motion.div>
);

export function GridView({
  cards,
  loading = false,
  onCardClick,
  onShare,
  onEdit,
  onDelete,
}: GridViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <CardSkeleton key={`skeleton-${index}`} index={index} />
            ))
          : cards.map((card, index) => (
              <CardItem
                key={card.id}
                card={card}
                index={index}
                onCardClick={onCardClick}
                onShare={onShare}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
      </motion.div>

      {!loading && cards.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Info className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No cards found</h3>
          <p className="text-muted-foreground max-w-md">
            You don't have any business cards yet. Create your first card to get
            started.
          </p>
        </motion.div>
      )}
    </div>
  );
}

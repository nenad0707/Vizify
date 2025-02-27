"use client";

import { useState, useCallback, useEffect, memo } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Share2, Star, Eye, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QuickActions } from "./QuickActions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useInView } from "react-intersection-observer";

interface BusinessCard {
  id: string;
  name: string;
  title: string;
  color: string;
  createdAt?: string;
  isFavorite?: boolean;
  email?: string;
  phone?: string;
  company?: string;
  tags?: string[];
}

interface GridViewProps {
  cards: BusinessCard[];
  loading?: boolean;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  onCardClick?: (card: BusinessCard) => void;
  onShare?: (card: BusinessCard) => void;
}

const CardItem = memo(({ 
  card, 
  index, 
  onToggleFavorite, 
  onCardClick,
  onShare
}: { 
  card: BusinessCard; 
  index: number;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  onCardClick?: (card: BusinessCard) => void;
  onShare?: (card: BusinessCard) => void;
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(card.id, !card.isFavorite);
    }
  }, [card.id, card.isFavorite, onToggleFavorite]);
  
  const handleCardClick = useCallback(() => {
    if (onCardClick) {
      onCardClick(card);
    }
  }, [card, onCardClick]);
  
  const handleShareClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) {
      onShare(card);
    }
  }, [card, onShare]);
  
  const toggleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(prev => !prev);
  }, []);
  
  const initials = card.name
    .split(' ')
    .map(name => name[0])
    .join('');
    
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      onClick={handleCardClick}
      className="h-full"
    >
      <Card 
        className="overflow-hidden bg-card/70 backdrop-blur-sm border-border/50 hover:border-border transition-all shadow-md hover:shadow-lg group h-full flex flex-col cursor-pointer"
        tabIndex={0}
        role="article"
        aria-labelledby={`card-title-${card.id}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCardClick();
          }
        }}
      >
        <div
          className="h-2 w-full"
          style={{ backgroundColor: card.color }}
        ></div>
        
        <CardHeader className="pb-2 relative">
          <div className="flex justify-between items-start">
            <CardTitle id={`card-title-${card.id}`} className="text-lg font-semibold truncate pr-6">
              {card.name}
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={handleToggleFavorite}
                    aria-label={card.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    className="focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1"
                  >
                    <Star 
                      className={`h-4 w-4 transition-all ${
                        card.isFavorite 
                          ? "text-chart-4 fill-chart-4" 
                          : "text-muted-foreground group-hover:text-chart-4"
                      }`} 
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {card.isFavorite ? "Remove from favorites" : "Add to favorites"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-muted-foreground truncate">{card.title}</p>
          
          {card.company && (
            <p className="text-xs text-muted-foreground mt-1 truncate">{card.company}</p>
          )}
        </CardHeader>
        
        <CardContent className="flex-grow">
          <div
            className="h-28 w-full rounded-lg shadow-inner flex items-center justify-center relative overflow-hidden mb-3 transition-all group-hover:scale-[1.02] group-hover:shadow"
            style={{ backgroundColor: card.color }}
          >
            <div className="text-white font-bold text-xl opacity-40">
              {initials}
            </div>
            
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <div className="text-white text-sm p-3 text-center">
                <Eye className="h-4 w-4 mx-auto mb-1" />
                <p>Click to view details</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            {card.tags && card.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {card.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs py-0">
                    {tag}
                  </Badge>
                ))}
                {card.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs py-0">
                    +{card.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-muted-foreground space-y-1 pt-2"
                >
                  {card.email && (
                    <p className="truncate">
                      <span className="font-medium">Email:</span> {card.email}
                    </p>
                  )}
                  {card.phone && (
                    <p className="truncate">
                      <span className="font-medium">Phone:</span> {card.phone}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
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
          <QuickActions card={card} />
          
          {card.createdAt && (
            <div className="flex items-center text-xs text-muted-foreground ml-auto">
              <CalendarDays className="h-3 w-3 mr-1" />
              {new Date(card.createdAt).toLocaleDateString()}
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
});

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
  onToggleFavorite,
  onCardClick,
  onShare
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
        transition={{ duration: 0.3 }}
      >
        {loading ? (
          // Render skeletons when loading
          Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={`skeleton-${index}`} index={index} />
          ))
        ) : (
          // Render actual cards
          cards.map((card, index) => (
            <CardItem 
              key={card.id} 
              card={card} 
              index={index}
              onToggleFavorite={onToggleFavorite}
              onCardClick={onCardClick}
              onShare={onShare}
            />
          ))
        )}
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
            You don't have any business cards yet. Create your first card to get started.
          </p>
        </motion.div>
      )}
    </div>
  );
}
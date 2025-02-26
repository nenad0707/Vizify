"use client";

import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Share2, Star } from "lucide-react";
import { motion } from "framer-motion";
import { QuickActions } from "./QuickActions";

interface BusinessCard {
  id: string;
  name: string;
  title: string;
  color: string;
  createdAt?: string;
  isFavorite?: boolean;
}

export function GridView({ cards }: { cards: BusinessCard[] }) {
  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ y: -4 }}
        >
          <Card className="overflow-hidden bg-card/70 backdrop-blur-sm border-border/50 hover:border-border transition-all shadow-md hover:shadow-lg group">
            <div
              className="h-2 w-full"
              style={{ backgroundColor: card.color }}
            ></div>
            
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold">{card.name}</CardTitle>
                {card.isFavorite && (
                  <Star className="h-4 w-4 text-chart-4 fill-chart-4" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">{card.title}</p>
            </CardHeader>
            
            <CardContent>
              <div
                className="h-28 w-full rounded-lg shadow-inner flex items-center justify-center relative overflow-hidden mb-3 transition-all group-hover:scale-[1.02] group-hover:shadow"
                style={{ backgroundColor: card.color }}
              >
                <div className="text-white font-bold text-xl opacity-40">
                  {card.name.split(' ').map(name => name[0]).join('')}
                </div>
              </div>
              
              {card.createdAt && (
                <div className="flex items-center text-xs text-muted-foreground mt-2">
                  <CalendarDays className="h-3 w-3 mr-1" />
                  {new Date(card.createdAt).toLocaleDateString()}
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between pt-2 border-t border-border/40">
              <Badge variant="outline" className="h-6 bg-muted/50 hover:bg-muted">
                <Share2 className="h-3 w-3 mr-1" /> Share
              </Badge>
              <QuickActions card={card} />
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
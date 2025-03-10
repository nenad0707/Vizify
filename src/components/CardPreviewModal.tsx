"use client";

import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import QRCodeComponent from "@/components/QRCodeComponent";
import { EyeIcon, Download, Share2, X } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import { useRouter } from "next/navigation";
import LivePreview from "@/components/LivePreview";
import { cn } from "@/lib/utils";

interface CardPreviewModalProps {
  open: boolean;
  onOpenChange: (redirected?: boolean) => void;
  card: any;
  allowRedirect?: boolean;
}

export function CardPreviewModal({
  open,
  onOpenChange,
  card,
  allowRedirect = false,
}: CardPreviewModalProps) {
  const router = useRouter();

  const handleViewCardClick = () => {
    onOpenChange(true);
    router.push(`/card/${card.id}`);
  };

  const cardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/card/${card.id}`;

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(false)}>
      <DialogContent className="max-w-md sm:max-w-xl w-full p-0 bg-background dark:bg-darkGlassBg backdrop-blur-xl border border-border dark:border-darkBorder rounded-lg shadow-lg overflow-hidden">
        <DialogHeader className="p-6 pb-0 space-y-1">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2"
          >
            <div className="p-1.5 rounded-full bg-primary/10">
              <EyeIcon className="h-4 w-4 text-primary" />
            </div>
            <DialogTitle className="text-xl">Your Card is Ready!</DialogTitle>
          </motion.div>
          <DialogDescription className="text-sm text-muted-foreground">
            Your digital business card has been created successfully. Share it with others using the QR code or link.
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Card preview grid */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
            {/* Card preview */}
            <div className="sm:col-span-3 space-y-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <span>Card Preview</span>
                <span className="text-xs text-muted-foreground font-normal bg-muted/50 px-2 py-0.5 rounded-sm">
                  Interactive
                </span>
              </h3>
              
              <div className={cn(
                "bg-gradient-to-br from-muted/50 to-background rounded-lg overflow-hidden border border-border/40",
                "h-[250px] sm:h-[220px] flex items-center justify-center"
              )}>
                <div className="w-full max-w-[300px]">
                  <LivePreview 
                    data={{
                      name: card.name,
                      title: card.title,
                      email: card.email,
                      phone: card.phone,
                      company: card.company,
                      color: card.color,
                      template: card.template
                    }} 
                    interactive={true} 
                  />
                </div>
              </div>
            </div>
            
            {/* QR Code and sharing */}
            <div className="sm:col-span-2 flex flex-col gap-3">
              <h3 className="text-sm font-medium">Share Your Card</h3>
              <div className="bg-white rounded-lg p-3 flex items-center justify-center border border-border/40">
                <QRCodeComponent url={cardUrl} size={120} />
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Scan with a phone camera to view
              </p>
              
              <div className="text-center text-xs text-primary font-mono mt-1 px-2 py-1 bg-muted/50 rounded-md border border-border/30 truncate">
                {cardUrl}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-3 p-6 pt-0">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto flex items-center gap-1.5"
          >
            <X className="h-3.5 w-3.5" />
            Close
          </Button>
          
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-3">
            {allowRedirect && (
              <Button 
                onClick={handleViewCardClick}
                size="sm"
                className="flex items-center gap-1.5 w-full sm:w-auto"
              >
                <EyeIcon className="h-3.5 w-3.5" />
                View Card
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

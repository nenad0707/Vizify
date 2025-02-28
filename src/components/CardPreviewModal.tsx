"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import QRCodeComponent from "@/components/QRCodeComponent";
import React from "react";

interface CardPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: {
    id: string;
    name: string;
    title: string;
    color: string;
  };
}

export function CardPreviewModal({
  open,
  onOpenChange,
  card,
}: CardPreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm w-full p-6 bg-background dark:bg-darkGlassBg backdrop-blur-xl border border-border dark:border-darkBorder rounded-lg shadow-lg">
        <DialogTitle className="sr-only">Your Business Card</DialogTitle>
        <DialogDescription className="sr-only">
          This is your final card with a unique URL and QR code.
        </DialogDescription>

        <h2 className="text-2xl font-bold mb-4">Your Business Card</h2>
        <p className="text-sm text-muted-foreground mb-6">
          This is your final card with a unique URL and QR code.
        </p>

        <div
          style={{
            backgroundColor: card.color,
            padding: "2rem",
            borderRadius: "8px",
          }}
          className="mb-4"
        >
          <h2 className="text-xl font-bold">{card.name}</h2>
          <p>{card.title}</p>
        </div>
        <div className="flex justify-center items-center mb-4">
          <QRCodeComponent
            url={`${process.env.NEXT_PUBLIC_APP_URL}/card/${card.id}`}
            size={128}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={() => (window.location.href = `/card/${card.id}`)}>
            View Card
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

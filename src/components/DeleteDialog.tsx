"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardName: string;
  cardId: string;
  onDelete: () => void;
}

export function DeleteDialog({
  open,
  onOpenChange,
  cardName,
  cardId,
  onDelete,
}: DeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete card");
      }

      toast.success("Card deleted successfully", {
        description: `${cardName} has been removed from your cards.`,
      });

      onDelete();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting card:", error);
      toast.error("Failed to delete card", {
        description: "Please try again later.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card/95 backdrop-blur-sm border-border/50 shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Card</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{cardName}</strong>? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

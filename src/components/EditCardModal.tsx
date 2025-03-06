"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, X, Save } from "lucide-react";
import { toast } from "sonner";
import ColorPicker from "@/components/ColorPicker";
import LivePreview from "@/components/LivePreview";

interface CardData {
  id: string;
  name: string;
  title: string;
  color: string;
  template: string;
  email?: string; // This comes from the user model, not the card
  company?: string; // These fields don't exist in the database but we include them for UI
  phone?: string; // These fields don't exist in the database but we include them for UI
}

interface EditCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: CardData;
  onUpdate: () => void;
}

export function EditCardModal({ open, onOpenChange, card, onUpdate }: EditCardModalProps) {
  const [formData, setFormData] = useState<CardData>({...card});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (color: string) => {
    setFormData(prev => ({ ...prev, color }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Only send fields that exist in the database
      const { name, title, color } = formData;
      
      const res = await fetch(`/api/cards/${card.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, title, color }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update card");
      }

      toast.success("Card updated successfully");
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating card:", error);
      toast.error("Failed to update card");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Card</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form fields section */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Display email (from user) as read-only */}
              {formData.email && (
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="opacity-70"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Email is linked to your account and cannot be changed here
                  </p>
                </div>
              )}

              <div>
                <Label>Card Color</Label>
                <ColorPicker 
                  selectedColor={formData.color} 
                  setSelectedColor={handleColorChange}
                />
              </div>
            </div>

            {/* Preview section */}
            <div className="flex flex-col space-y-4">
              <h3 className="text-sm font-medium">Live Preview</h3>
              <div className="bg-muted/30 rounded-md p-3 h-56 flex items-center justify-center">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full max-w-[300px]"
                >
                  <LivePreview data={formData} />
                </motion.div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

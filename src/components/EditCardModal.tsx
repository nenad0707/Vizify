"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ColorPicker from "@/components/ColorPicker";
import { BusinessCard } from "@/types";
import { TemplateSelector } from "@/components/ui/template-selector";
import LivePreview from "@/components/LivePreview";

interface EditCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: BusinessCard;
  onUpdate: () => void;
}

export function EditCardModal({
  card,
  open,
  onOpenChange,
  onUpdate,
}: EditCardModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    color: "",
    template: "modern", // Default value so it's never undefined
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalName, setOriginalName] = useState("");

  useEffect(() => {
    if (card) {
      setFormData({
        name: card.name,
        title: card.title,
        color: card.color,
        template: card.template || "modern", // Default to modern if not set
      });
      setOriginalName(card.name);
      setError(null);
    }
  }, [card, open]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error && error.includes("name")) {
      setError(null);
    }
    setFormData({ ...formData, name: e.target.value });
  };

  const handleTemplateChange = (template: string) => {
    setFormData({ ...formData, template });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Make API call
      const response = await fetch(`/api/cards/${card.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle duplicate name error
        if (response.status === 409) {
          setError(data.error || "Name already exists");
          toast.error("Failed to update card", {
            description: "Please choose a different name.",
          });
        } else {
          // Other errors
          setError(data.error || "Failed to update card");
          toast.error("Failed to update card", {
            description: "Please try again later.",
          });
        }
        setIsSubmitting(false);
        return; // Early return instead of throwing
      }

      toast.success("Card updated", {
        description: "Your changes have been saved successfully.",
      });

      onUpdate();
      onOpenChange(false);
    } catch (error: any) {
      // This will only activate for network errors or JSON parse errors
      setError("Network error or server unavailable");
      toast.error("Connection error", {
        description: "Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Business Card</DialogTitle>
          <DialogDescription>
            Make changes to your business card below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {error && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="name"
                className={`text-right ${
                  error && error.includes("name") ? "text-destructive" : ""
                }`}
              >
                Name
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  className={`${
                    error && error.includes("name")
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                  required
                />
                {error && error.includes("name") && (
                  <p className="text-xs text-destructive">
                    This name is already in use. Please choose a different name.
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Job Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Card Color</Label>
              <div className="col-span-3">
                <ColorPicker
                  selectedColor={formData.color}
                  setSelectedColor={(color) =>
                    setFormData({ ...formData, color })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Template</Label>
              <div className="col-span-3">
                <TemplateSelector
                  value={formData.template}
                  onChange={handleTemplateChange}
                />
              </div>
            </div>

            {/* Live Preview of the card */}
            <div className="mt-4 col-span-4">
              <Label className="mb-2 block">Preview</Label>
              <div className="max-w-xs mx-auto">
                <LivePreview
                  data={formData}
                  interactive={false}
                  className="shadow-md"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

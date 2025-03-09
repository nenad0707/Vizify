"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Copy, Check, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PREMIUM_PRESETS = ["#1E293B", "#6366F1", "#8B5CF6", "#10B981", "#F59E0B"];

interface ColorPickerProps {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  showPresets?: boolean;
}

export default function ColorPicker({
  selectedColor,
  setSelectedColor,
  showPresets = true,
}: ColorPickerProps) {
  const [copied, setCopied] = useState(false);
  const [localColor, setLocalColor] = useState(selectedColor || "#6366F1");

  useEffect(() => {
    setLocalColor(selectedColor || "#6366F1");
  }, [selectedColor]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(selectedColor);
    setCopied(true);
    toast.success("Color copied to clipboard", {
      description: `${selectedColor} is now in your clipboard`,
      position: "top-center",
      duration: 2000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative flex items-center gap-3 px-4 py-3 border border-border/50 rounded-lg bg-background shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group w-full">
          <div className="relative">
            <span
              className="flex w-8 h-8 rounded-md border border-border/40 shadow-sm group-hover:shadow-md transition-all overflow-hidden"
              style={{ backgroundColor: selectedColor }}
            >
              <span className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/10" />
            </span>
            <Palette className="absolute bottom-[-5px] right-[-5px] h-3.5 w-3.5 text-foreground/60 bg-background rounded-full p-0.5" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-foreground">
              Brand Color
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {selectedColor.toUpperCase()}
            </span>
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-64 p-4 bg-background/80 backdrop-blur-sm shadow-lg rounded-lg border border-border/40"
        sideOffset={5}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-4"
        >
          {/* Color display */}
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-md shadow-sm border border-border/50"
              style={{ backgroundColor: localColor }}
            >
              <div className="w-full h-full bg-gradient-to-br from-white/5 to-black/10" />
            </div>
            <div className="flex-1 relative">
              <div className="flex items-center justify-between px-2 py-1.5 h-9 font-mono text-sm border rounded-md bg-muted/20">
                <span>{localColor.toUpperCase()}</span>
                <button
                  onClick={copyToClipboard}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="Copy color"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {false && (
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Choose Color
              </Label>
              <div className="relative overflow-hidden rounded-md border border-border/50">
                <input
                  type="color"
                  value={localColor}
                  onChange={(e) => setLocalColor(e.target.value)}
                  onBlur={(e) => setSelectedColor(e.target.value)}
                  className="w-full h-12 cursor-pointer rounded-md border-0 shadow-sm"
                  style={{ padding: 0 }}
                />
              </div>
            </div>
          )}

          {showPresets && (
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">
                Premium Colors
              </Label>
              <div className="grid grid-cols-5 gap-3 p-1">
                {PREMIUM_PRESETS.map((color) => (
                  <motion.button
                    key={color}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "w-10 h-10 rounded-md border transition-all transform",
                      selectedColor.toLowerCase() === color.toLowerCase()
                        ? "border-primary shadow-md ring-2 ring-primary/20 scale-105"
                        : "border-border/40 hover:border-primary/50",
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  >
                    {selectedColor.toLowerCase() === color.toLowerCase() && (
                      <div className="flex items-center justify-center">
                        <Check className="h-4 w-4 text-white drop-shadow-sm" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}

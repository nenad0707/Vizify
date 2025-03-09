"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Copy, Check, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PREMIUM_PRESETS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#10b981",
  "#f59e0b",
  "#3b82f6",
  "#1e293b",
];

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
  const [localColor, setLocalColor] = useState(selectedColor);
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);

  useEffect(() => {
    setLocalColor(selectedColor);
  }, [selectedColor]);

  useEffect(() => {
    const saved = localStorage.getItem("vizify-recent-colors");
    if (saved) {
      try {
        setRecentlyUsed(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved colors", e);
      }
    }
  }, []);

  const addToRecentlyUsed = (color: string) => {
    const newRecent = [color, ...recentlyUsed.filter((c) => c !== color)].slice(
      0,
      5,
    );

    setRecentlyUsed(newRecent);
    localStorage.setItem("vizify-recent-colors", JSON.stringify(newRecent));
  };

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

  const applyColor = (color: string) => {
    setSelectedColor(color);
    addToRecentlyUsed(color);
  };

  const formatColor = (color: string) => {
    return color.startsWith("#") ? color : `#${color}`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative flex items-center gap-3 px-4 py-3 border border-border/50 rounded-lg bg-background shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
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
            <span className="text-sm font-medium text-foreground">Color</span>
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
          {/* Color preview i hex input */}
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-md shadow-sm border border-border/50"
              style={{ backgroundColor: localColor }}
            >
              <div className="w-full h-full bg-gradient-to-br from-white/5 to-black/10" />
            </div>
            <div className="flex-1 relative">
              <Input
                type="text"
                value={localColor}
                onChange={(e) => setLocalColor(e.target.value)}
                onBlur={() => applyColor(localColor)}
                onKeyDown={(e) => e.key === "Enter" && applyColor(localColor)}
                className="px-2 py-1 h-9 font-mono text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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

          {/* Color picker */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Choose Color
            </Label>
            <div className="relative overflow-hidden rounded-md border border-border/50">
              <Input
                type="color"
                value={localColor}
                onChange={(e) => setLocalColor(e.target.value)}
                onBlur={(e) => applyColor(e.target.value)}
                className="w-full h-12 cursor-pointer rounded-md border-0 shadow-sm"
                style={{ padding: 0 }}
              />
            </div>
          </div>

          {/* Color presets */}
          {showPresets && (
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Premium Presets
              </Label>
              <div className="flex flex-wrap gap-2">
                {PREMIUM_PRESETS.map((color) => (
                  <button
                    key={color}
                    className={cn(
                      "w-7 h-7 rounded-md border transition-all transform hover:scale-110",
                      selectedColor.toLowerCase() === color.toLowerCase()
                        ? "border-primary shadow-sm ring-1 ring-primary/20"
                        : "border-border/40 hover:border-primary/50",
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => applyColor(color)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recently used colors */}
          {recentlyUsed.length > 0 && (
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Recently Used
              </Label>
              <div className="flex flex-wrap gap-2">
                {recentlyUsed.map((color) => (
                  <button
                    key={color}
                    className={cn(
                      "w-7 h-7 rounded-md border transition-all transform hover:scale-110 relative",
                      selectedColor.toLowerCase() === color.toLowerCase()
                        ? "border-primary shadow-sm ring-1 ring-primary/20"
                        : "border-border/40 hover:border-primary/50",
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => applyColor(color)}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}

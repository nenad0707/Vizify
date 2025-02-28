"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function ColorPicker({ selectedColor, setSelectedColor }: { selectedColor: string; setSelectedColor: (color: string) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative flex items-center gap-3 px-4 py-2 border border-border/50 rounded-md bg-background shadow-sm hover:shadow-md transition-all cursor-pointer">
      
          <span
            className="w-6 h-6 rounded-full border border-border/40 shadow-md"
            style={{ backgroundColor: selectedColor }}
          />
          <span className="text-sm font-medium text-foreground">Pick a Color</span>
        </button>
      </PopoverTrigger>

     
      <PopoverContent className="w-40 p-3 bg-background shadow-lg rounded-md border border-border/40">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center gap-3"
        >
          <Input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-full h-10 cursor-pointer rounded-md border border-border/50 shadow-sm"
          />
          <span className="text-xs font-mono text-muted-foreground">{selectedColor.toUpperCase()}</span>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}

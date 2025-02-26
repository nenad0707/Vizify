"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { List, LayoutGrid, Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function DashboardHeader({
  viewMode,
  setViewMode,
}: {
  viewMode: "grid" | "table";
  setViewMode: (mode: "grid" | "table") => void;
}) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          My Business Cards
        </h2>
        <p className="text-muted-foreground mt-1">
          Manage your digital business presence efficiently.
        </p>
      </motion.div>

      <motion.div 
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="relative flex-1 sm:max-w-xs">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${searchFocused ? 'text-primary' : ''}`} />
          <Input
            placeholder="Search cards..."
            className={`pl-10 transition-all border-border ${searchFocused ? 'border-primary ring-2 ring-primary/20' : 'hover:border-border/80'}`}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
            className="border-border/60 hover:bg-muted transition-all"
            aria-label={`Switch to ${viewMode === "grid" ? "table" : "grid"} view`}
          >
            {viewMode === "grid" ? 
              <List className="w-5 h-5" /> : 
              <LayoutGrid className="w-5 h-5" />
            }
          </Button>

          <Button 
            variant="default" 
            className="flex gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Card</span>
          </Button>
        </div>
      </motion.div>
    </header>
  );
}
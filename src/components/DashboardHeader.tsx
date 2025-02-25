"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { List, LayoutGrid, Plus } from "lucide-react";

export function DashboardHeader({
  viewMode,
  setViewMode,
}: {
  viewMode: "grid" | "table";
  setViewMode: (mode: "grid" | "table") => void;
}) {
  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
    
      <div>
        <h2 className="text-2xl font-bold">My Business Cards</h2>
        <p className="text-muted-foreground">Manage your business cards easily.</p>
      </div>

   
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
       
        <Input
          placeholder="Search cards..."
          className="flex-1 sm:w-auto"
        />


        <Button
          variant="outline"
          onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
        >
          {viewMode === "grid" ? <List className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
        </Button>

       
        <Button variant="default" className="flex gap-2">
          <Plus className="w-5 h-5" />
          New Card
        </Button>
      </div>
    </header>
  );
}

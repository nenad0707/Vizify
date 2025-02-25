"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { List, LayoutGrid, Plus } from "lucide-react";

export function DashboardHeader({ viewMode, setViewMode }: { viewMode: string; setViewMode: (mode: "grid" | "table") => void }) {
  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold">My Business Cards</h2>
        <p className="text-muted-foreground">Manage your business cards easily.</p>
      </div>
      <div className="flex gap-2">
        <Input placeholder="Search cards..." className="max-w-sm" />
        <Button variant="outline" onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}>
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

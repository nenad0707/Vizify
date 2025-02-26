"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { GridView } from "@/components/GridView";
import { TableView } from "@/components/TableView";
import { DashboardHeader } from "@/components/DashboardHeader";
import { EmptyState } from "@/components/EmptyState";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">(
    () => (localStorage.getItem("viewMode") as "grid" | "table") || "grid"
  );

  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    async function fetchCards() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/cards");
        
        if (!res.ok) {
          throw new Error("Failed to fetch cards");
        }
        
        const data = await res.json();
        setCards(data);
      } catch (error) {
        console.error("Error fetching cards:", error);
        setError("There was a problem loading your cards. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    
    if (session) {
      fetchCards();
    }
  }, [session]);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center max-w-md p-8 rounded-xl bg-gradient-to-b from-gradient-start to-gradient-end shadow-lg border border-glass-border">
          <h2 className="text-2xl font-bold mb-3">Welcome to Dashboard</h2>
          <p className="text-muted-foreground mb-6">Please sign in to view your business cards and manage your digital presence.</p>
          <button className="btn bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-lg font-medium transition-all">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto pt-6 px-4 pb-24 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-b from-background to-muted/20 rounded-xl p-6 shadow-lg border border-border/50"
      >
        <DashboardHeader viewMode={viewMode} setViewMode={setViewMode} />
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {loading ? (
          <div className="space-y-4 mt-6">
            <Skeleton className="h-12 w-full rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-48 w-full rounded-lg" />
              ))}
            </div>
          </div>
        ) : cards.length === 0 ? (
          <EmptyState />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {viewMode === "grid" ? (
                <GridView cards={cards} />
              ) : (
                <TableView cards={cards} />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </main>
  );
}
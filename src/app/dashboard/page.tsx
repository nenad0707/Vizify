"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { TableView } from "@/components/TableView";
import { GridView } from "@/components/GridView";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  useEffect(() => {
    async function fetchCards() {
      try {
        const res = await fetch("/api/cards");
        const data = await res.json();
        setCards(data);
      } catch (error) {
        console.error("Error fetching cards:", error);
      } finally {
        setLoading(false);
      }
    }
    if (session) fetchCards();
  }, [session]);

  if (!session) return <p className="text-center mt-10">Please sign in to view your dashboard.</p>;

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="max-w-5xl mx-auto py-10 px-4 flex-1">
        <DashboardHeader viewMode={viewMode} setViewMode={setViewMode}/>
        {loading ? (
          <Skeleton className="h-40 w-full rounded-lg" />
        ) : viewMode === "grid" ? (
          <GridView cards={cards} />
        ) : (
          <TableView cards={cards} />
        )}
      </div>
    </main>

  );
}

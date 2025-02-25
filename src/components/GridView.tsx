"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export function GridView({
  cards,
}: {
  cards: { id: string; name: string; title: string; color: string }[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <Card
          key={card.id}
          className="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-card"
        >
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{card.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{card.title}</p>
          </CardHeader>
          <CardContent>
            <div
              className="h-16 w-full rounded-lg"
              style={{ backgroundColor: card.color }}
            ></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    const card = await prisma.businessCard.findUnique({
      where: { id },
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: card.id,
      name: card.name,
      title: card.title,
      color: card.color,
      template: card.template,
      createdAt: card.createdAt,
      qrCode: card.qrCode,
    });
  } catch (error) {
    console.error("Error fetching public card:", error);
    return NextResponse.json({ error: "Error fetching card" }, { status: 500 });
  }
}

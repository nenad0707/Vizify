import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } },
) {
  const id = context.params.id;

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
      createdAt: card.createdAt,
      qrCode: card.qrCode,
    });
  } catch (error) {
    console.error("Error fetching public card:", error);
    return NextResponse.json({ error: "Error fetching card" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const cards = await prisma.businessCard.findMany({
      where: { userId: session.user.id },
    });
    return NextResponse.json(cards, { status: 200 });
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch cards" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { name, title, color } = await request.json();
    if (!name || !title) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const existingCard = await prisma.businessCard.findFirst({
      where: { userId: session.user.id, name },
    });
    if (existingCard) {
      return NextResponse.json(
        { error: "A card with this name already exists." },
        { status: 409 },
      );
    }

    const card = await prisma.businessCard.create({
      data: {
        userId: session.user.id,
        name,
        title,
        color: color || "#ffffff",
        qrCode: "",
      },
    });
    const qrCodeUrl = `${process.env.NEXTAUTH_URL}/card/${card.id}`;
    const updatedCard = await prisma.businessCard.update({
      where: { id: card.id },
      data: { qrCode: qrCodeUrl },
    });
    return NextResponse.json(updatedCard, { status: 201 });
  } catch (error) {
    console.error("Error creating card:", error);
    return NextResponse.json(
      { error: "Failed to create card" },
      { status: 500 },
    );
  }
}

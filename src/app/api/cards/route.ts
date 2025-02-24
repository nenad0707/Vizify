import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const cards = await prisma.businessCard.findMany({
      where: { userId: session.user.id },
    });
    return NextResponse.json(cards, { status: 200 });
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch cards",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {

    const body = await req.json();
    const { name, title, color } = body || {};
    if (!name || !title) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found in database." },
        { status: 404 }
      );
    }
  
    const existingCard = await prisma.businessCard.findFirst({
      where: { userId: session.user.id, name },
    });
    if (existingCard) {
      return NextResponse.json(
        { error: "A card with this name already exists." },
        { status: 409 }
      );
    }
   
    const card = await prisma.businessCard.create({
      data: {
        userId: session.user.id,
        name,
        title,
        color: color || "#ffffff",
        qrCode: `${process.env.NEXTAUTH_URL}/card/${name}`,
      },
    });
    return NextResponse.json(card, { status: 201 });
  } catch (error: any) {
    console.error(
      "Error creating card:",
      error instanceof Error ? error.message : JSON.stringify(error)
    );
    return NextResponse.json(
      {
        error: "Failed to create card",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

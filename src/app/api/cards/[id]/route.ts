import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params?: { id?: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!context.params || !context.params.id) {
    return NextResponse.json({ error: "Missing card ID" }, { status: 400 });
  }

  try {
    const card = await prisma.businessCard.findUnique({
      where: { id: context.params.id },
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    if (card.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(card);
  } catch (error) {
    console.error("Error fetching card:", error);
    return NextResponse.json(
      { error: "Error fetching card" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params?: { id?: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!context.params || !context.params.id) {
    return NextResponse.json({ error: "Missing card ID" }, { status: 400 });
  }

  try {
    const { name, title, color } = await req.json();

    const card = await prisma.businessCard.findUnique({
      where: { id: context.params.id },
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    if (card.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedCard = await prisma.businessCard.update({
      where: { id: context.params.id },
      data: { name, title, color },
    });

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error("Error updating card:", error);
    return NextResponse.json(
      { error: "Error updating card" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params?: { id?: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!context.params || !context.params.id) {
    return NextResponse.json({ error: "Missing card ID" }, { status: 400 });
  }

  try {
    const card = await prisma.businessCard.findUnique({
      where: { id: context.params.id },
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    if (card.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.businessCard.delete({
      where: { id: context.params.id },
    });

    return NextResponse.json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error("Error deleting card:", error);
    return NextResponse.json(
      { error: "Failed to delete card" },
      { status: 500 }
    );
  }
}

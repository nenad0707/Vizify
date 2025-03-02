import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type RouteContext = {
  params: { id: string };
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = context.params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const card = await prisma.businessCard.findUnique({
      where: { id },
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
    return NextResponse.json({ error: "Error fetching card" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id } = context.params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, title, color } = await request.json();

    // First find the existing card
    const card = await prisma.businessCard.findUnique({ where: { id } });
    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Check if user has access to the card
    if (card.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if a card with the same name already exists for this user
    if (name !== card.name) {
      // Only if name is changing
      const existingCard = await prisma.businessCard.findFirst({
        where: {
          userId: session.user.id,
          name,
          id: { not: id }, // Don't count the current card
        },
      });

      if (existingCard) {
        return NextResponse.json(
          {
            error: `A card with the name "${name}" already exists. Please choose a different name.`,
          },
          { status: 409 },
        );
      }
    }

    // Proceed with updating the card
    const updatedCard = await prisma.businessCard.update({
      where: { id },
      data: { name, title, color },
    });

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error("Error updating card:", error);
    return NextResponse.json({ error: "Error updating card" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = context.params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const card = await prisma.businessCard.findUnique({ where: { id } });
    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }
    if (card.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await prisma.businessCard.delete({ where: { id } });
    return NextResponse.json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error("Error deleting card:", error);
    return NextResponse.json(
      { error: "Failed to delete card" },
      { status: 500 },
    );
  }
}

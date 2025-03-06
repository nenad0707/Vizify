import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Define the params type as used by Next.js App Router
type RouteParams = {
  params: {
    id: string;
  };
};

// Handle PATCH requests to update a card
export async function PATCH(
  request: Request,
  { params }: RouteParams
): Promise<Response> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = params.id;

    // Parse the request body
    const { name, title, color } = await request.json();

    // Check if user is authorized to update this card
    const existingCard = await prisma.businessCard.findUnique({
      where: { id },
    });

    if (!existingCard) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    if (existingCard.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check for duplicate card names
    if (name !== existingCard.name) {
      const duplicateCard = await prisma.businessCard.findFirst({
        where: {
          userId: session.user.id,
          name,
          id: { not: id }, // Exclude current card
        },
      });

      if (duplicateCard) {
        return NextResponse.json(
          { error: "A card with this name already exists" },
          { status: 409 }
        );
      }
    }

    // Update the card
    const updatedCard = await prisma.businessCard.update({
      where: { id },
      data: {
        name,
        title,
        color,
      },
    });

    // Fetch the user's email to include in the response
    const user = await prisma.user.findUnique({
      where: { id: updatedCard.userId },
      select: { email: true },
    });

    // Return the card with user's email
    return NextResponse.json({
      ...updatedCard,
      email: user?.email || null,
    });
  } catch (error) {
    console.error("Error updating card:", error);
    return NextResponse.json(
      { error: "Failed to update card" },
      { status: 500 }
    );
  }
}

// Handle GET request for a specific card
export async function GET(
  request: Request,
  { params }: RouteParams
): Promise<Response> {
  const session = await getServerSession(authOptions);

  try {
    const id = params.id;

    const card = await prisma.businessCard.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Check if user is authorized to view this card (if it's their card)
    if (!session || card.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Restructure the data to include user email at the top level
    const cardWithEmail = {
      ...card,
      email: card.user.email,
      user: undefined, // Remove nested user object
    };

    return NextResponse.json(cardWithEmail);
  } catch (error) {
    console.error("Error fetching card:", error);
    return NextResponse.json(
      { error: "Failed to fetch card" },
      { status: 500 }
    );
  }
}

// Handle DELETE request
export async function DELETE(
  request: Request,
  { params }: RouteParams
): Promise<Response> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = params.id;

    const existingCard = await prisma.businessCard.findUnique({
      where: { id },
    });

    if (!existingCard) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    if (existingCard.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete the card
    await prisma.businessCard.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting card:", error);
    return NextResponse.json(
      { error: "Failed to delete card" },
      { status: 500 }
    );
  }
}
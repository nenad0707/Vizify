import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const card = await prisma.businessCard.findUnique({
      where: {
        id,
      },
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    if (card.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Return only the fields that actually exist in the database model
    return NextResponse.json({
      id: card.id,
      name: card.name,
      title: card.title,
      color: card.color,
      template: card.template,
      qrCode: card.qrCode,
      createdAt: card.createdAt,
      userId: card.userId,
    });
  } catch (error) {
    console.error("Error fetching card:", error);
    return NextResponse.json(
      { error: "Failed to fetch card" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, title, color, template } = await request.json();

    if (!name || !title) {
      return NextResponse.json(
        { error: "Name and title are required" },
        { status: 400 },
      );
    }

    // Validate template - must be one of the allowed values
    const allowedTemplates = ["modern", "classic", "minimalist"];
    if (template && !allowedTemplates.includes(template)) {
      return NextResponse.json(
        {
          error:
            "Invalid template value. Must be one of: modern, classic, or minimalist",
        },
        { status: 400 },
      );
    }

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
      data: {
        name,
        title,
        color,
        template: template || "modern", // Ensure template is saved with a default value
      },
    });

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error("Error updating card:", error);
    return NextResponse.json({ error: "Error updating card" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await context.params;

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

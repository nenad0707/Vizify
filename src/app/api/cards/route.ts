import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request): Promise<Response> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    // Fetch cards with user info to get email
    const cards = await prisma.businessCard.findMany({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            email: true,
          }
        }
      }
    });
    
    // Restructure the data to include email at the top level
    const formattedCards = cards.map(card => ({
      ...card,
      email: card.user.email,
      user: undefined // Remove nested user object
    }));
    
    return NextResponse.json(formattedCards, { status: 200 });
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch cards" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request): Promise<Response> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Only extract the fields that exist in your BusinessCard model
    const { name, title, color, template } = await request.json();

    // Check for required fields
    if (!name || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check for duplicate card names
    const existingCard = await prisma.businessCard.findFirst({
      where: { userId: session.user.id, name },
    });

    if (existingCard) {
      return NextResponse.json(
        {
          error: `A card with the name "${name}" already exists. Please choose a different name.`,
          cardId: existingCard.id,
        },
        { status: 409 },
      );
    }

    // Create the new card with only valid fields
    const card = await prisma.businessCard.create({
      data: {
        userId: session.user.id,
        name,
        title,
        color: color || "#ffffff",
        template: template || "modern", // Use provided template or default to "modern"
        qrCode: "",
      },
    });

    const qrCodeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/card/${card.id}`;

    const updatedCard = await prisma.businessCard.update({
      where: { id: card.id },
      data: { qrCode: qrCodeUrl },
    });

    // Fetch the user's email to include in the response
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true },
    });

    // Return the card with user's email
    return NextResponse.json({
      ...updatedCard,
      email: user?.email || null,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating card:", error);
    return NextResponse.json(
      { error: "Failed to create card" },
      { status: 500 },
    );
  }
}
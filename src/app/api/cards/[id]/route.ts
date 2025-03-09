import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Handle GET request - return a specific card
export async function GET(req: Request, { params }: any) {
  try {
    // Get session first before accessing route params
    const session = await getServerSession(authOptions);

    // Access the ID directly from params object without intermediate assignment
    // This approach works reliably in Next.js App Router
    const result = await prisma.businessCard.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    // Handle card not found
    if (!result) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Check authorization
    if (!session || result.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Prepare the response
    const response = {
      ...result,
      email: result.user?.email,
      user: undefined, // Remove nested user object
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching card:", error);
    return NextResponse.json(
      { error: "Failed to fetch card" },
      { status: 500 },
    );
  }
}

// Handle PATCH request - update a card
export async function PATCH(req: Request, { params }: any) {
  try {
    // Get session first before accessing route params
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the existing card
    const existingCard = await prisma.businessCard.findUnique({
      where: { id: params.id },
    });

    // Handle not found or unauthorized
    if (!existingCard) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    if (existingCard.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get request body
    const data = await req.json();
    const { name, title, color } = data;

    // Check for duplicate names
    if (name !== existingCard.name) {
      const duplicateCheck = await prisma.businessCard.findFirst({
        where: {
          userId: session.user.id,
          name,
          id: { not: params.id },
        },
      });

      if (duplicateCheck) {
        return NextResponse.json(
          { error: "A card with this name already exists" },
          { status: 409 },
        );
      }
    }

    // Update the card
    const updatedCard = await prisma.businessCard.update({
      where: { id: params.id },
      data: { name, title, color },
    });

    // Get user email
    const user = await prisma.user.findUnique({
      where: { id: updatedCard.userId },
      select: { email: true },
    });

    // Return response
    return NextResponse.json({
      ...updatedCard,
      email: user?.email || null,
    });
  } catch (error) {
    console.error("Error updating card:", error);
    return NextResponse.json(
      { error: "Failed to update card" },
      { status: 500 },
    );
  }
}

// Handle DELETE request - delete a card
export async function DELETE(req: Request, { params }: any) {
  try {
    // Get session first before accessing route params
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the card
    const existingCard = await prisma.businessCard.findUnique({
      where: { id: params.id },
    });

    // Handle not found or unauthorized
    if (!existingCard) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    if (existingCard.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete the card
    await prisma.businessCard.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting card:", error);
    return NextResponse.json(
      { error: "Failed to delete card" },
      { status: 500 },
    );
  }
}

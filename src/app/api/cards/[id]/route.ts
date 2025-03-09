import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    const id = context.params.id;

    if (!id) {
      return new NextResponse("ID is required", { status: 400 });
    }

    const result = await prisma.businessCard.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!result) {
      return new NextResponse("Card not found", { status: 404 });
    }

    // Only allow access to own cards
    if (!session || session.user?.email !== result.user.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching card:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const id = context.params.id;
    if (!id) {
      return new NextResponse("ID is required", { status: 400 });
    }

    // First check if the card exists and belongs to the user
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
      return new NextResponse("Card not found", { status: 404 });
    }

    // Verify ownership
    if (card.user.email !== session.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete the card
    await prisma.businessCard.delete({
      where: { id },
    });

    return new NextResponse("Card deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting card:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const id = context.params.id;
    if (!id) {
      return new NextResponse("ID is required", { status: 400 });
    }

    const body = await request.json();

    // First check if the card exists and belongs to the user
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
      return new NextResponse("Card not found", { status: 404 });
    }

    // Verify ownership
    if (card.user.email !== session.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Update the card
    const updatedCard = await prisma.businessCard.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedCard, { status: 200 });
  } catch (error) {
    console.error("Error updating card:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

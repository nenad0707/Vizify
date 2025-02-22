import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const card = await prisma.businessCard.findUnique({
      where: { id: params.id },
    });

    if (!card || card.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(card);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching card" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, title, color } = await req.json();
    const updatedCard = await prisma.businessCard.update({
      where: { id: params.id },
      data: { name, title, color },
    });
    return NextResponse.json(updatedCard);
  } catch (error) {
    return NextResponse.json({ error: "Error updating card" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.businessCard.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Card deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete card" },
      { status: 500 },
    );
  }
}

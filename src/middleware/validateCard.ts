import { prisma } from "@/lib/prisma";

export async function validateCardUpdate(
  userId: string,
  cardId: string,
  name: string,
) {
  const existingCard = await prisma.businessCard.findFirst({
    where: {
      userId,
      name,
      id: { not: cardId },
    },
  });

  return {
    isValid: !existingCard,
    error: existingCard
      ? `A card with the name "${name}" already exists. Please choose a different name.`
      : null,
  };
}

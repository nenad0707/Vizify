import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import QRCodeComponent from "@/components/QRCodeComponent";

interface PageProps {
  params: { id: string };
}

export default async function CardPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const card = await prisma.businessCard.findUnique({
    where: { id: params.id },
  });
  if (!card) {
    return <div>Card not found.</div>;
  }
  if (card.userId !== session.user.id) {
    return <div>Access Denied.</div>;
  }
  const cardUrl = `${process.env.NEXTAUTH_URL}/card/${card.id}`;
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{card.name}</h1>
      <p>{card.title}</p>
      <div
        id="card-preview"
        style={{
          backgroundColor: card.color,
          padding: "2rem",
          borderRadius: "8px",
        }}
      >
        <h2>{card.name}</h2>
        <p>{card.title}</p>
      </div>
      <div className="mt-4">
        <QRCodeComponent url={cardUrl} size={128} />
        <p>Scan QR code for direct access</p>
      </div>
    </div>
  );
}

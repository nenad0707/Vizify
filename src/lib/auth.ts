import NextAuth, { type NextAuthOptions } from "next-auth";
import type { DefaultSession, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import type { Account, User } from "next-auth";

// 🔹 Proširujemo tip Session objekta da uključuje ID korisnika
declare module "next-auth" {
  interface Session {
    user: {
      id: string;  // ✅ Dodajemo ID
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;  // ✅ Dodajemo ID u JWT
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Email Login",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const providerId = `credentials-${credentials.email}`;

        let user = await prisma.user.findUnique({
          where: { providerId },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: "Anonymous User",
              provider: "credentials",
              providerId,
            },
          });
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // ✅ Kada se korisnik prvi put prijavi, dodajemo njegov ID u token
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      // ✅ Dodajemo ID iz tokena u session user objekt
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

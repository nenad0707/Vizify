import NextAuth, { type NextAuthOptions } from "next-auth";
import type { DefaultSession, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import type { Account, User } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      provider: string;
    } & DefaultSession["user"];
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
    async signIn({ user, account }: { user: User; account: Account | null }) {
      if (!user.email) return false;

      const providerId =
        account?.provider === "credentials"
          ? `credentials-${user.email}`
          : `${account?.provider}-${user.email}`;

      let existingUser = await prisma.user.findUnique({
        where: { providerId },
      });

      if (!existingUser) {
        existingUser = await prisma.user.create({
          data: {
            email: user.email!,
            name: user.name || "New User",
            image: user.image || null,
            provider: account?.provider || "unknown",
            providerId,
          },
        });
      }

      return true;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.provider = token.provider as string;
      }
      return session;
    },

    async jwt({ token, account }: { token: JWT; account: Account | null }) {
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

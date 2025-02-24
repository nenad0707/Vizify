import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";

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
    async signIn({ user, account }) {
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
    async jwt({ token, account, user }) {
      if (user) {
        const providerId: string = account
          ? `${account.provider as string}-${user.email}`
          : (token.provider as string);
          
        const dbUser = await prisma.user.findUnique({
          where: { providerId },
        });
        if (dbUser) {
          token.sub = dbUser.id;
        }
      }
      if (account) {
        token.provider = account.provider as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
      
        session.user.id = token.sub;
        session.user.provider = token.provider as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

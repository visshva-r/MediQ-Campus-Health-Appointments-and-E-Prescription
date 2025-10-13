// src/lib/authOptions.ts
import type { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      // You can add "allowDangerousEmailAccountLinking: true" during dev if needed
    }),
  ],
  session: {
    // default is jwt; db sessions also work with adapter but jwt is simpler for app router
    strategy: "jwt",
  },
  callbacks: {
    /**
     * Put the user's role into the JWT so middleware can read it.
     */
    async jwt({ token, user }) {
      // When user logs in first time `user` is defined; later only `token` is.
      if (user) {
        // @ts-ignore - type safe augmentation done below
        token.role = (user as any).role ?? "STUDENT";
      }
      return token;
    },
    /**
     * Expose role on the session object (client/server components can read it).
     */
    async session({ session, token }) {
      // @ts-ignore
      session.role = (token as any).role ?? "STUDENT";
      return session;
    },
  },
  pages: {
    // Optional: use default pages, or add your own at /app/(auth)/signin
    // signIn: "/signin"
  }
};
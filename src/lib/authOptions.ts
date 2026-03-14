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
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  session: {
    strategy: "jwt", // jwt sessions are simpler for App Router
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user && "role" in user) {
        const role = (user as { role?: "STUDENT" | "DOCTOR" | "ADMIN" }).role;
        token.role = role ?? "STUDENT";
      }
      return token;
    },
    async session({ session, token }) {
      session.role = token.role ?? "STUDENT";
      return session;
    },
  },

  pages: {
    // (optional custom pages)
    // signIn: "/signin"
  },

  // ✅ Optional but helpful for debugging sign-in errors
  debug: process.env.NODE_ENV !== "production",
};

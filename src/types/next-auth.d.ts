// src/types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    role?: "STUDENT" | "DOCTOR" | "ADMIN";
    user?: DefaultSession["user"] & { id?: string; };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "STUDENT" | "DOCTOR" | "ADMIN";
  }
}

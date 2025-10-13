// src/lib/auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";

export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Guard for server code (route handlers / server actions / server components).
 * Throws 403 if role insufficient.
 */
export async function requireRole(role: "ADMIN" | "DOCTOR" | "STUDENT" = "STUDENT") {
  const session = await getSession();
  const sRole = (session as any)?.role ?? "STUDENT";

  if (role === "STUDENT") return session;

  const ok =
    (role === "DOCTOR" && (sRole === "DOCTOR" || sRole === "ADMIN")) ||
    (role === "ADMIN" && sRole === "ADMIN");

  if (!ok) {
    const err = new Error("Forbidden");
    // @ts-ignore
    err.status = 403;
    throw err;
  }
  return session;
}
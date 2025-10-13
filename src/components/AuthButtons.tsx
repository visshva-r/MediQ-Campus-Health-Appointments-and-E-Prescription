// src/components/AuthButtons.tsx
"use client";

import { signIn, signOut } from "next-auth/react";

export default function AuthButtons({ signedIn }: { signedIn: boolean }) {
  if (signedIn) {
    return (
      <button onClick={() => signOut()} className="px-3 py-2 rounded bg-gray-900 text-white">
        Sign out
      </button>
    );
  }
  return (
    <button onClick={() => signIn("google")} className="px-3 py-2 rounded bg-blue-600 text-white">
      Sign in with Google
    </button>
  );
}

"use client";
import { useState } from "react";

export default function BookButton({
  doctorId,
  slotId,
}: { doctorId: string; slotId: string }) {
  const [loading, setLoading] = useState(false);

  async function book() {
    setLoading(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId, slotId }),
      });
      if (!res.ok) throw new Error("Booking failed");
      window.location.href = "/me/appointments";
    } catch (e: any) {
      alert(e.message || "Error booking");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={book}
      disabled={loading}
      className="px-3 py-2 rounded bg-emerald-600 text-white disabled:opacity-50"
    >
      {loading ? "Booking..." : "Book"}
    </button>
  );
}

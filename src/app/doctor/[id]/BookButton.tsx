"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BookButton({ doctorId, slotId }: { doctorId: string; slotId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onBook() {
    setLoading(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId, slotId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to book");
      alert("Appointment booked!");
      router.push("/me/appointments");
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to book");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={onBook}
      disabled={loading}
      className="px-3 py-2 rounded bg-emerald-600 text-white disabled:opacity-50"
    >
      {loading ? "Booking..." : "Book"}
    </button>
  );
}

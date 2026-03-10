"use client";
import { useState } from "react";

export default function BookButton({
  doctorId,
  slotId,
}: { doctorId: string; slotId: string }) {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState(""); // 1. Added state for the reason

  async function book() {
    setLoading(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 2. Added reason to the data being sent to the database
        body: JSON.stringify({ doctorId, slotId, reason }), 
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
    // 3. Wrapped the button and a new input field in a flexbox layout
    <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
      <input
        type="text"
        placeholder="Reason (e.g., Fever)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="border border-gray-300 rounded p-2 text-sm w-48 focus:outline-emerald-500"
      />
      <button
        onClick={book}
        disabled={loading}
        className="px-3 py-2 rounded bg-emerald-600 text-white disabled:opacity-50"
      >
        {loading ? "Booking..." : "Book"}
      </button>
    </div>
  );
}
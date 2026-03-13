"use client";
import { useState } from "react";

export default function BookButton({
  doctorId,
  slotId,
}: { doctorId: string; slotId: string }) {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function book() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId, slotId, reason }), 
      });
      if (!res.ok) {
        let message = "Booking failed";
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch {
          // ignore json parse errors
        }
        throw new Error(message);
      }
      window.location.href = "/me/appointments";
    } catch (e: any) {
      setError(e?.message || "Error booking");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center">
      <div className="flex flex-col gap-1">
        <input
          type="text"
          placeholder="Reason (e.g., Fever)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="border border-gray-300 rounded p-2 text-sm w-48 focus:outline-emerald-500"
        />
        {error && (
          <p className="text-xs text-red-500 max-w-xs text-right sm:text-left">
            {error}
          </p>
        )}
      </div>
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
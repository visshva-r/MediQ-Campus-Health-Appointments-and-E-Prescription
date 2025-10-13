"use client";
import { useState } from "react";

export default function DeleteDoctorButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this doctor and all their slots/appointments?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/doctors/${id}`, { method: "DELETE" });

      // Be defensive: Try JSON; if that fails, read text.
      let payload: any = null;
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        payload = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      if (!res.ok || !payload?.ok) {
        throw new Error(payload?.error || `HTTP ${res.status}`);
      }

      alert("Deleted!");
      location.reload();
    } catch (e: any) {
      alert(e?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-2 bg-red-600 rounded text-white disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}

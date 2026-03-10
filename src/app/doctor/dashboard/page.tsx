import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { fmtDateTime, fmtTime } from "@/lib/date";
import { revalidatePath } from "next/cache"; // 1. Added this import!

export const dynamic = "force-dynamic";

export default async function DoctorDashboard() {
  await requireRole("DOCTOR"); // ADMIN also passes via requireRole

  // ---- server actions for status updates ----
  async function setStatus(formData: FormData) {
    "use server";
    const id = String(formData.get("id") || "");
    const status = String(formData.get("status") || "PENDING") as
      | "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
    if (!id) return;
    
    await prisma.appointment.update({ where: { id }, data: { status } });
    
    // 2. Added revalidatePath so the screen refreshes immediately after clicking a button
    revalidatePath("/doctor"); 
  }

  // show upcoming (today onward), pending first
  const appts = await prisma.appointment.findMany({
    where: { slot: { start: { gte: new Date() } } },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: { user: true, doctor: true, slot: true },
    take: 100,
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Doctor Dashboard</h1>
      {appts.length === 0 ? (
        <div className="rounded border p-4 text-sm text-gray-400">No upcoming appointments.</div>
      ) : (
        <ul className="space-y-2">
          {appts.map(a => (
            <li key={a.id} className="rounded border p-4 space-y-1">
              <div className="flex items-center justify-between">
                
                {/* 3. THIS IS THE FIX! It now checks for Name first, then Email, then "Student" */}
                <div className="font-medium text-lg text-emerald-600">
                  {a.user?.name || a.user?.email || "Student"}
                </div>
                
                <div className="text-xs px-2 py-1 rounded border">
                  {a.status}
                </div>
              </div>
              <div className="text-sm text-gray-300">
                {fmtDateTime(new Date(a.slot.start))} — {fmtTime(new Date(a.slot.end))}
              </div>
              {a.reason && <div className="text-sm">Reason: {a.reason}</div>}
              <div className="flex gap-2 pt-2">
                <form action={setStatus}>
                  <input type="hidden" name="id" value={a.id} />
                  <input type="hidden" name="status" value="CONFIRMED" />
                  <button className="px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-500">Confirm</button>
                </form>
                <form action={setStatus}>
                  <input type="hidden" name="id" value={a.id} />
                  <input type="hidden" name="status" value="COMPLETED" />
                  <button className="px-3 py-1.5 rounded bg-sky-600 text-white hover:bg-sky-500">Complete</button>
                </form>
                <form action={setStatus}>
                  <input type="hidden" name="id" value={a.id} />
                  <input type="hidden" name="status" value="CANCELLED" />
                  <button className="px-3 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-500">Cancel</button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
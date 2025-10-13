import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { fmtDateTime, fmtTime } from "@/lib/date";
import Link from "next/link";

export const dynamic = "force-dynamic"; // always fresh list

export default async function AdminSlotsPage({
  searchParams,
}: { searchParams?: { doctorId?: string } }) {
  await requireRole("ADMIN");

  const doctors = await prisma.doctor.findMany({ orderBy: { name: "asc" } });
  if (doctors.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Slots</h1>
        <p>No doctors yet. Create one in <Link className="text-blue-500" href="/admin">Admin</Link>.</p>
      </div>
    );
  }

  const activeDoctorId = searchParams?.doctorId ?? doctors[0].id;

  // ---- server actions ----
  async function deleteSlot(formData: FormData) {
    "use server";
    const id = String(formData.get("slotId") || "");
    if (!id) return;
    // optional guard: block if booked
    const appts = await prisma.appointment.count({ where: { slotId: id } });
    if (appts > 0) throw new Error("Cannot delete: slot has appointments");
    await prisma.slot.delete({ where: { id } });
  }

  async function deleteFutureSlots(formData: FormData) {
    "use server";
    const did = String(formData.get("doctorId") || "");
    if (!did) return;
    await prisma.slot.deleteMany({ where: { doctorId: did, start: { gte: new Date() } } });
  }

  // list upcoming slots for selected doctor
  const slots = await prisma.slot.findMany({
    where: { doctorId: activeDoctorId, start: { gte: new Date() } },
    orderBy: { start: "asc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Slots</h1>

      {/* doctor selector */}
      <form className="flex gap-2">
        <select
          name="doctorId"
          defaultValue={activeDoctorId}
          className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800"
          onChange={(e) => {
            // simple clientless navigation
            const v = e.currentTarget.value;
            // @ts-ignore
            window.location = `/admin/slots?doctorId=${v}`;
          }}
        >
          {doctors.map(d => (
            <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>
          ))}
        </select>
        <form action={deleteFutureSlots}>
          <input type="hidden" name="doctorId" value={activeDoctorId} />
          <button className="px-3 py-2 rounded bg-amber-600 text-white">
            Delete ALL future slots for this doctor
          </button>
        </form>
      </form>

      {/* slots list */}
      {slots.length === 0 ? (
        <div className="rounded border p-4 text-sm text-gray-400">
          No upcoming slots for this doctor.
        </div>
      ) : (
        <ul className="space-y-2">
          {slots.map(s => (
            <li key={s.id} className="flex items-center justify-between rounded border p-3">
              <div className="text-sm">
                {fmtDateTime(new Date(s.start))} — {fmtTime(new Date(s.end))}
                <span className="ml-2 text-gray-400">
                  (capacity {s.capacity}, booked {s.bookedCount})
                </span>
              </div>
              <form action={deleteSlot}>
                <input type="hidden" name="slotId" value={s.id} />
                <button className="px-3 py-2 rounded bg-red-600 text-white">
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

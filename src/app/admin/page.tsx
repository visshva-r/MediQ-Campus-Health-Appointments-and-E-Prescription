import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import DeleteDoctorButton from "./DeleteDoctorButton";

export default async function AdminPage() {
  await requireRole("ADMIN");
  const doctors = await prisma.doctor.findMany({ orderBy: { name: "asc" } });

  async function createDoctor(formData: FormData) {
    "use server";
    const name = String(formData.get("name") || "");
    const specialty = String(formData.get("specialty") || "");
    const room = String(formData.get("room") || "");
    if (!name || !specialty) return;
    await prisma.doctor.create({ data: { name, specialty, room, active: true } });
  }

  async function createSlots(formData: FormData) {
    "use server";
    const doctorId = String(formData.get("doctorId") || "");
    const date = String(formData.get("date") || "");
    const start = String(formData.get("start") || "09:00");
    const count = Number(formData.get("count") || 6);
    const duration = Number(formData.get("duration") || 10);
    const capacity = Number(formData.get("capacity") || 2);
    if (!doctorId || !date) return;

    const base = new Date(`${date}T${start}:00`);
    for (let i = 0; i < count; i++) {
      const s = new Date(base.getTime() + i * duration * 60000);
      const e = new Date(s.getTime() + duration * 60000);
      await prisma.slot.create({
        data: { doctorId, start: s, end: e, capacity, bookedCount: 0 },
      });
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-10">
      <h1 className="text-2xl font-semibold">Admin Panel</h1>

      {/* Add Doctor */}
      <form action={createDoctor} className="space-y-3 border p-4 rounded">
        <h2 className="font-medium">Add Doctor</h2>
        <input
          name="name"
          placeholder="Name"
          required
          className="w-full px-2 py-1 rounded bg-neutral-800"
        />
        <input
          name="specialty"
          placeholder="Specialty"
          required
          className="w-full px-2 py-1 rounded bg-neutral-800"
        />
        <input name="room" placeholder="Room" className="w-full px-2 py-1 rounded bg-neutral-800" />
        <button className="px-3 py-2 bg-blue-600 text-white rounded">Add Doctor</button>
      </form>

      {/* Add Slots */}
      <form action={createSlots} className="space-y-3 border p-4 rounded">
        <h2 className="font-medium">Add Slots</h2>
        <select
          name="doctorId"
          required
          className="w-full px-2 py-1 rounded bg-neutral-800"
        >
          {doctors.map((d: any) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <input
          type="date"
          name="date"
          required
          className="w-full px-2 py-1 rounded bg-neutral-800"
        />
        <input type="time" name="start" defaultValue="10:00" className="w-full px-2 py-1 rounded bg-neutral-800" />
        <input type="number" name="count" defaultValue={6} className="w-full px-2 py-1 rounded bg-neutral-800" />
        <input type="number" name="duration" defaultValue={10} className="w-full px-2 py-1 rounded bg-neutral-800" />
        <input type="number" name="capacity" defaultValue={2} className="w-full px-2 py-1 rounded bg-neutral-800" />
        <button className="px-3 py-2 bg-emerald-600 text-white rounded">Create Slots</button>
      </form>

      {/* Optional list with delete buttons */}
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Existing Doctors</h2>
        {doctors.map((d: any) => (
          <div key={d.id} className="flex items-center justify-between border rounded p-3">
            <div>{d.name} — {d.specialty}</div>
            <DeleteDoctorButton id={d.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
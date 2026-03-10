import { prisma } from "@/lib/prisma";
import { fmtDateTime, fmtTime } from "@/lib/date";
import Link from "next/link";
import BookButton from "./BookButton";

export const dynamic = "force-dynamic";

export default async function DoctorDetail({
  params,
}: { params: Promise<{ id: string }> }) {
  // We have to await the params in Next.js 15!
  const { id } = await params; 
  
  const doctor = await prisma.doctor.findUnique({ where: { id: id } });
  if (!doctor) {
    return (
      <div className="rounded border p-4">
        Doctor not found. <Link className="text-blue-500" href="/doctors">Back</Link>
      </div>
    );
  }

  const upcoming = await prisma.slot.findMany({
    where: { doctorId: doctor.id, start: { gte: new Date() } },
    orderBy: { start: "asc" },
    take: 50,
  });
  const available = upcoming.filter(s => s.bookedCount < s.capacity);

  return (
    <div className="space-y-6">
      <div className="rounded border p-4">
        <h1 className="text-2xl font-semibold">{doctor.name}</h1>
        <p className="text-sm text-gray-400">
          {doctor.specialty}{doctor.room ? ` · Room ${doctor.room}` : ""}
        </p>
        {doctor.bio && <p className="mt-2">{doctor.bio}</p>}
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-medium">Available slots</h2>
        {available.length === 0 ? (
          <div className="rounded border p-4 text-sm text-gray-400">
            No available slots. <Link className="text-blue-500" href="/doctors">Back</Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {available.map(s => (
              <li key={s.id} className="flex items-center justify-between rounded border p-3">
                <div className="text-sm">
                  {fmtDateTime(new Date(s.start))} — {fmtTime(new Date(s.end))}
                  <span className="ml-2 text-gray-400">
                    ({s.capacity - s.bookedCount} left)
                  </span>
                </div>
                <BookButton doctorId={doctor.id} slotId={s.id} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

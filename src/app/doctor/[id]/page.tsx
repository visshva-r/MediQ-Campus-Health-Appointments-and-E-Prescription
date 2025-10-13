import { prisma } from "@/lib/prisma";
import { Card, CardMeta, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { fmtDateTime, fmtTime } from "@/lib/date";
import BookButton from "./BookButton";

export default async function DoctorDetail({ params }: { params: { id: string } }) {
  const doctor = await prisma.doctor.findUnique({ where: { id: params.id } });
  if (!doctor) return <Card>Doctor not found.</Card>;

  const upcoming = await prisma.slot.findMany({
    where: { doctorId: doctor.id, start: { gte: new Date() } },
    orderBy: { start: "asc" },
    take: 30,
  });
  const available = upcoming.filter(s => s.bookedCount < s.capacity);

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle className="text-xl">{doctor.name}</CardTitle>
        <CardMeta>{doctor.specialty}{doctor.room ? ` · Room ${doctor.room}` : ""}</CardMeta>
        {doctor.bio && <p className="mt-2">{doctor.bio}</p>}
      </Card>

      <div className="space-y-3">
        <h2 className="text-xl font-medium">Available slots</h2>
        {available.length === 0 && <Card className="text-sm text-gray-400">No available slots.</Card>}
        {available.map(s => (
          <Card key={s.id} className="flex items-center justify-between">
            <div className="text-sm">
              {fmtDateTime(new Date(s.start))} — {fmtTime(new Date(s.end))}
              <span className="ml-2 text-gray-400">
                ({s.capacity - s.bookedCount} left)
              </span>
            </div>
            <BookButton doctorId={doctor.id} slotId={s.id} />
          </Card>
        ))}
      </div>
    </div>
  );
}

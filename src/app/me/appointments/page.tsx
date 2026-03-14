import type { Appointment } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Card, CardTitle, CardMeta } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { fmtDateTime, fmtTime } from "@/lib/date";
import Link from "next/link";

const statusClass = (s: string) =>
  s === "PENDING"   ? "bg-amber-500/15 text-amber-400 border-amber-600/30" :
  s === "CONFIRMED" ? "bg-emerald-500/15 text-emerald-400 border-emerald-600/30" :
  s === "COMPLETED" ? "bg-sky-500/15 text-sky-400 border-sky-600/30" :
  /* CANCELLED */     "bg-rose-500/15 text-rose-400 border-rose-600/30";

export default async function MyAppointments() {
  const session = await getSession();
  if (!session?.user?.email) return <Card>Please sign in.</Card>;

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return <Card>User not found.</Card>;

  const appts = await prisma.appointment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { doctor: true, slot: true },
  });

  if (appts.length === 0) {
    return (
      <Card className="text-center text-sm text-gray-400">
        No appointments yet — book your first one from <Link className="text-blue-500" href="/doctors">Doctors</Link>.
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {appts.map((a: Appointment & { doctor: { name: string; specialty: string }; slot: { start: Date; end: Date } }) => (
        <Card key={a.id} className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle>{a.doctor.name} — {a.doctor.specialty}</CardTitle>
            <Badge className={statusClass(a.status)}>{a.status}</Badge>
          </div>
          <CardMeta>
            {fmtDateTime(new Date(a.slot.start))} — {fmtTime(new Date(a.slot.end))}
          </CardMeta>
          {a.reason && <p className="text-sm mt-1">{a.reason}</p>}
          {a.prescriptionUrl && <a className="text-sm text-blue-500" href={a.prescriptionUrl} target="_blank">Prescription</a>}
        </Card>
      ))}
    </div>
  );
}

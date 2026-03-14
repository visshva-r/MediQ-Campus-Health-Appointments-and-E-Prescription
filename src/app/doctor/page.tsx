import Link from "next/link";
import type { Doctor } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Card, CardTitle, CardMeta } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default async function DoctorsPage() {
  const doctors = await prisma.doctor.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  if (doctors.length === 0) {
    return (
      <Card className="text-center text-sm text-gray-400">
        No doctors yet — create one from <Link className="text-blue-500" href="/admin">Admin</Link>.
      </Card>
    );
  }

  return (
    <div className="grid gap-3">
      {doctors.map((d: Doctor) => (
        <Card key={d.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-neutral-800 grid place-items-center font-medium">{d.name[0]}</div>
            <div>
              <CardTitle>{d.name}</CardTitle>
              <CardMeta>{d.specialty}{d.room ? ` · Room ${d.room}` : ""}</CardMeta>
            </div>
          </div>
          <Link href={`/doctors/${d.id}`}><Button>View</Button></Link>
        </Card>
      ))}
    </div>
  );
}

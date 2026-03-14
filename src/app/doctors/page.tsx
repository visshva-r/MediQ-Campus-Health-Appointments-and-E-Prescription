import Link from "next/link";
import type { Doctor } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DoctorsPage() {
  const doctors = await prisma.doctor.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Doctors</h1>
      {doctors.length === 0 ? (
        <p>No doctors available yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {doctors.map((d: Doctor) => (
            <div
              key={d.id}
              className="border border-neutral-700 rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <div className="font-semibold">{d.name}</div>
                <div className="text-sm text-neutral-400">
                  {d.specialty} · Room {d.room || "—"}
                </div>
              </div>
              <Link
                href={`/doctors/${d.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

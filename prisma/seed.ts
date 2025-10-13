import { prisma } from "../src/lib/prisma";

async function main() {
  const d = await prisma.doctor.create({
    data: { name: "Dr. Aishwarya", specialty: "General Medicine", room: "B-102" },
  });
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 15);
  await prisma.slot.create({ data: { doctorId: d.id, start, end, capacity: 2 } });
}
main().finally(()=>process.exit(0));

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json(); // { doctorId, slotId, reason? }
  const { doctorId, slotId, reason } = body ?? {};
  if (!doctorId || !slotId) {
    return NextResponse.json({ error: "doctorId and slotId required" }, { status: 400 });
  }

  // ensure we have the user's id
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const slot = await tx.slot.findUnique({
        where: { id: slotId },
        select: { capacity: true, bookedCount: true, doctorId: true },
      });
      if (!slot || slot.doctorId !== doctorId) throw new Error("Invalid slot");
      if (slot.bookedCount >= slot.capacity) throw new Error("Slot full");

      const appt = await tx.appointment.create({
        data: { userId: user.id, doctorId, slotId, reason: reason ?? "" },
        include: { doctor: true, slot: true },
      });
      await tx.slot.update({
        where: { id: slotId },
        data: { bookedCount: { increment: 1 } },
      });
      return appt;
    });

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to book" }, { status: 400 });
  }
}

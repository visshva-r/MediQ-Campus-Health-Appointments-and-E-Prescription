import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  await requireRole("ADMIN"); // or "DOCTOR" if you want doctors to manage their own
  const id = params.id;

  // Optional guard: block if any booking exists
  const apptCount = await prisma.appointment.count({ where: { slotId: id } });
  if (apptCount > 0) {
    return NextResponse.json(
      { error: "Cannot delete: slot has appointments" },
      { status: 409 }
    );
  }

  await prisma.slot.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/slots?doctorId=<id>&date=YYYY-MM-DD (date optional)
 * Returns non-full slots for the doctor (optionally for the given day).
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get("doctorId");
  const date = searchParams.get("date"); // YYYY-MM-DD

  if (!doctorId) {
    return NextResponse.json({ error: "doctorId required" }, { status: 400 });
  }

  let where: any = { doctorId };
  if (date) {
    const start = new Date(date + "T00:00:00");
    const end = new Date(date + "T23:59:59.999");
    where.start = { gte: start, lte: end };
  }

  const slots = await prisma.slot.findMany({
    where,
    orderBy: { start: "asc" },
  });

  // filter out full slots
  const available = slots.filter((s: any) => s.bookedCount < s.capacity);

  return NextResponse.json({ data: available });
}

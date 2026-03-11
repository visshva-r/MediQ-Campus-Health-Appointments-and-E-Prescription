import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { appointmentId, fileUrl } = body;

    if (!appointmentId || !fileUrl) {
      return NextResponse.json(
        { error: "Missing appointmentId or fileUrl" }, 
        { status: 400 }
      );
    }

    // Update the specific appointment with the new prescription link
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { prescriptionUrl: fileUrl },
    });

    return NextResponse.json({ ok: true, data: updatedAppointment });
  } catch (error) {
    console.error("Failed to save prescription to DB:", error);
    return NextResponse.json(
      { error: "Failed to save prescription" }, 
      { status: 500 }
    );
  }
}
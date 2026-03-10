import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function DELETE(
  _req: Request, 
  { params }: { params: Promise<{ id: string }> } // Added Promise
) {
  const { id } = await params; // Added await
  
  try {
    await prisma.slot.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete slot" }, { status: 500 });
  }
}
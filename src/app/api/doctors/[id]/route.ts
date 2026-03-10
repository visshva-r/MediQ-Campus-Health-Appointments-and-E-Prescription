import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// NEW WAY (Next.js 15)
export async function DELETE(
  _req: Request, 
  { params }: { params: Promise<{ id: string }> } // Change 1: Wrap in Promise
) {
  const { id } = await params; // Change 2: Await the params!
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const role = (session as any).role ?? "STUDENT";
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.doctor.delete({ where: { id: id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    // Always JSON, never HTML
    return NextResponse.json(
      { error: e?.message ?? "Delete failed" },
      { status: 500 }
    );
  }
}

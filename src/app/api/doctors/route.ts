// src/app/api/doctors/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page") ?? "1");
  const take = 10, skip = (page - 1) * take;

  const where = {
    OR: [
      { name: { contains: q, mode: "insensitive" } },
      { specialty: { contains: q, mode: "insensitive" } },
    ],
  };

  const [items, total] = await Promise.all([
    prisma.doctor.findMany({ where, orderBy: { name: "asc" }, skip, take }),
    prisma.doctor.count({ where }),
  ]);

  return NextResponse.json({ data: { items, page, total, pages: Math.ceil(total / take) } });
}

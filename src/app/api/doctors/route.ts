// src/app/api/doctors/route.ts
import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page") ?? "1");
  const take = 10; 
  const skip = (page - 1) * take;

  const where: Prisma.DoctorWhereInput = {
    OR: [
      { name: { contains: q, mode: "insensitive" } },
      { specialty: { contains: q, mode: "insensitive" } },
    ],
  };

  const [items, total] = await Promise.all([
    prisma.doctor.findMany({ where, orderBy: { name: "asc" }, skip, take }),
    prisma.doctor.count({ where }),
  ]);

  return NextResponse.json({ 
    data: { 
      items, 
      page, 
      total, 
      pages: Math.ceil(total / take) 
    } 
  });
}
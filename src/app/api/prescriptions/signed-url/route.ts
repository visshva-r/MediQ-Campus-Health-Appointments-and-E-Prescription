// src/app/api/prescriptions/signed-url/route.ts
import { NextResponse } from "next/server";
import { createSignedUpload } from "@/lib/signedUpload";

export async function POST(req: Request) {
  const { fileName } = await req.json();
  const data = await createSignedUpload(fileName);
  return NextResponse.json({ data });
}

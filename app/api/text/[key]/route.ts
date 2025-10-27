import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const entry = await prisma.textEntry.findUnique({ where: { key } });
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(entry);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const { value, lang } = await request.json();
  const updated = await prisma.textEntry.upsert({
    where: { key },
    update: { value, lang: lang || "fr" },
    create: { key, value, lang: lang || "fr" },
  });
  return NextResponse.json(updated);
}

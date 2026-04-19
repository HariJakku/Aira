import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const manifestPath = path.join(process.cwd(), "public", "gallery", "manifest.json");
    const data: any[] = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    const img = data.find((x) => x.id === id);
    if (!img) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(img);
  } catch {
    return NextResponse.json({ error: "Failed to load image" }, { status: 500 });
  }
}

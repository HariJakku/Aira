import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const manifestPath = path.join(process.cwd(), "public", "gallery", "manifest.json");
    const data = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const q = searchParams.get("q")?.toLowerCase();

    let filtered = data;

    if (category && category !== "all") {
      filtered = filtered.filter((img: any) => img.category === category);
    }

    if (q) {
      filtered = filtered.filter(
        (img: any) =>
          img.title.toLowerCase().includes(q) ||
          img.text.toLowerCase().includes(q) ||
          img.category.toLowerCase().includes(q) ||
          Object.values(img.specs || {}).some((v: any) =>
            v.toLowerCase().includes(q)
          )
      );
    }

    const categories: string[] = Array.from(
      new Set(data.map((img: any) => img.category))
    );

    return NextResponse.json({
      images: filtered,
      total: filtered.length,
      categories,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to load images" }, { status: 500 });
  }
}

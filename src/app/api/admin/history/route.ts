import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { listBackups } from "@/lib/history";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
    if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const categories = await listBackups("categories");
    const dishes = await listBackups("dishes");

    return NextResponse.json({ categories, dishes });
}

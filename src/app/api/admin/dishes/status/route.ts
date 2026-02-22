import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { loadDishes, saveDishes } from "@/lib/menuStore";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await req.json().catch(() => null)) as { id?: string; status?: "active" | "hidden" } | null;
    if (!body?.id || !body.status) return NextResponse.json({ error: "Missing id/status" }, { status: 400 });

    const wrap = await loadDishes();
    const idx = wrap.items.findIndex((d) => d.id === body.id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

    wrap.items[idx] = { ...wrap.items[idx], status: body.status };
    await saveDishes(wrap);

    return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { loadCategories, saveCategories } from "@/lib/menuStore";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await req.json().catch(() => null)) as { orderedIds?: string[] } | null;
    const orderedIds = body?.orderedIds ?? [];
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
        return NextResponse.json({ error: "Missing orderedIds" }, { status: 400 });
    }

    const wrap = await loadCategories();
    const byId = new Map(wrap.items.map((c) => [c.id, c]));
    const nextItems = orderedIds
        .map((id, i) => {
            const c = byId.get(id);
            return c ? { ...c, order: (i + 1) * 10 } : null;
        })
        .filter(Boolean) as typeof wrap.items;

    // keep any categories not included (just in case)
    const leftovers = wrap.items.filter((c) => !orderedIds.includes(c.id));
    wrap.items = [...nextItems, ...leftovers];
    await saveCategories(wrap);

    return NextResponse.json({ ok: true });
}

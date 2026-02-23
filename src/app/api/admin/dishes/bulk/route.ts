import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { loadDishes, saveDishes } from "@/lib/menuStore";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await req.json().catch(() => null)) as {
        categoryId?: string;
        items?: { id: string; order: number; status: "active" | "hidden"; vegetarian: boolean; topRated: boolean; chefsPick: boolean; soldOut: boolean }[];
    } | null;

    if (!body?.categoryId || !Array.isArray(body.items)) {
        return NextResponse.json({ error: "Missing categoryId/items" }, { status: 400 });
    }

    const keepIds = new Set(body.items.map((x) => x.id));
    const upd = new Map(body.items.map((x) => [x.id, x]));

    const wrap = await loadDishes();

    // 1) delete dishes in this category that are NOT in keepIds
    wrap.items = wrap.items.filter((d) => d.categoryId !== body.categoryId || keepIds.has(d.id));

    // 2) update order/status/booleans for remaining
    wrap.items = wrap.items.map((d) => {
        if (d.categoryId !== body.categoryId) return d;
        const u = upd.get(d.id);
        if (!u) return d;
        return {
            ...d,
            order: u.order,
            status: u.status,
            vegetarian: !!u.vegetarian,
            topRated: !!u.topRated,
            chefsPick: !!u.chefsPick,
            soldOut: !!u.soldOut
        };
    });

    await saveDishes(wrap);
    return NextResponse.json({ ok: true });
}

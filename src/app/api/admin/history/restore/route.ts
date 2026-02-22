import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { restoreBackup } from "@/lib/history";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await req.json().catch(() => null)) as { kind?: "categories" | "dishes"; file?: string } | null;
    if (!body?.kind || !body.file) return NextResponse.json({ error: "Missing kind/file" }, { status: 400 });

    try {
        await restoreBackup(body.kind, body.file);
        return NextResponse.json({ ok: true });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message ?? "Restore failed" }, { status: 400 });
    }
}

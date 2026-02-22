import { NextRequest, NextResponse } from "next/server";
import { getAdminCookieName, passwordMatches, signAdminSession } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null) as { password?: string } | null;
    const password = body?.password ?? "";

    if (!passwordMatches(password)) {
        return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 });
    }

    const token = signAdminSession(14); // 14 days
    const res = NextResponse.json({ ok: true });

    res.cookies.set({
        name: getAdminCookieName(),
        value: token,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 14 * 24 * 60 * 60,
    });

    return res;
}

import { NextRequest, NextResponse } from "next/server";
import { getPublicMenu } from "@/lib/menuStore";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
    const lang = (req.nextUrl.searchParams.get("lang") ?? "ka") as "ka" | "en" | "ru";
    const data = await getPublicMenu(lang);

    return NextResponse.json(
        { lang, categories: data },
        {
            headers: {
                // You can tune this later; fine for VPS cache + browser cache
                "Cache-Control": "public, max-age=30",
            },
        }
    );
}

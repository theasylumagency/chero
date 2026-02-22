import { NextRequest } from "next/server";
import { getAdminCookieName, verifyAdminSession } from "./adminAuth";

export function requireAdmin(req: NextRequest) {
    const token = req.cookies.get(getAdminCookieName())?.value;
    const ok = verifyAdminSession(token);
    return !!ok;
}

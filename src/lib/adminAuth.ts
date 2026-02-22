import crypto from "node:crypto";

const COOKIE_NAME = "admin_session";

type Payload = { exp: number };

function b64url(buf: Buffer) {
    return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function fromB64url(s: string) {
    s = s.replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    return Buffer.from(s, "base64");
}

function hmac(data: string, secret: string) {
    return crypto.createHmac("sha256", secret).update(data).digest();
}

export function signAdminSession(days = 7) {
    const secret = process.env.ADMIN_SECRET ?? "";
    if (!secret) throw new Error("Missing ADMIN_SECRET");

    const exp = Math.floor(Date.now() / 1000) + days * 24 * 60 * 60;
    const payload: Payload = { exp };
    const payloadStr = JSON.stringify(payload);
    const payloadB64 = b64url(Buffer.from(payloadStr, "utf8"));
    const sig = b64url(hmac(payloadB64, secret));
    return `${payloadB64}.${sig}`;
}

export function verifyAdminSession(token: string | undefined | null): Payload | null {
    if (!token) return null;
    const secret = process.env.ADMIN_SECRET ?? "";
    if (!secret) return null;

    const [payloadB64, sig] = token.split(".");
    if (!payloadB64 || !sig) return null;

    const expected = b64url(hmac(payloadB64, secret));

    // timing safe compare
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return null;
    if (!crypto.timingSafeEqual(a, b)) return null;

    let payload: Payload;
    try {
        payload = JSON.parse(fromB64url(payloadB64).toString("utf8")) as Payload;
    } catch {
        return null;
    }

    if (!payload.exp || Date.now() / 1000 > payload.exp) return null;
    return payload;
}

export function getAdminCookieName() {
    return COOKIE_NAME;
}

export function passwordMatches(input: string) {
    const expected = process.env.ADMIN_PASSWORD ?? "";
    // timing safe compare
    const a = Buffer.from(input);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
}

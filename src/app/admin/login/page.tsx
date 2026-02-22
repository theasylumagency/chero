"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const [password, setPassword] = useState("");
    const [err, setErr] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const router = useRouter();

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setBusy(true);
        setErr(null);

        const r = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        });

        if (!r.ok) {
            const j = await r.json().catch(() => ({}));
            setErr(j?.error ?? "Login failed");
            setBusy(false);
            return;
        }

        router.push("/admin");
        router.refresh();
    }

    return (
        <div style={{ maxWidth: 420, margin: "60px auto", fontFamily: "system-ui" }}>
            <h1>Admin Login</h1>
            <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ padding: 10, fontSize: 16 }}
                />
                <button disabled={busy} style={{ padding: 10, fontSize: 16 }}>
                    {busy ? "..." : "Login"}
                </button>
                {err && <div style={{ color: "crimson" }}>{err}</div>}
            </form>
        </div>
    );
}

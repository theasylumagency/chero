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
        <div className="min-h-screen bg-[#050B10] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Subtle background glow */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#B7C7FF]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-[#5361A5]/5 rounded-full blur-[140px] pointer-events-none" />

            <div className="w-full max-w-md bg-[#0F1320]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-10 shadow-2xl relative z-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-serif text-white mb-2 tracking-wide">Chero Workspace</h1>
                    <p className="text-[#9aa6bd] text-sm tracking-wide">Restricted Access</p>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-6">
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Authentication Phrase"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#111521] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-[#9aa6bd]/50 focus:outline-none focus:border-[#B7C7FF]/40 focus:ring-1 focus:ring-[#B7C7FF]/40 transition-all font-light tracking-widest"
                        />
                    </div>

                    <button
                        disabled={busy}
                        className="w-full bg-white text-[#0F1320] font-semibold py-4 rounded-xl uppercase tracking-widest text-sm hover:scale-[1.02] hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    >
                        {busy ? "Authenticating..." : "Enter Workspace"}
                    </button>

                    {err && (
                        <div className="text-red-400 text-sm italic text-center mt-2 px-4 py-3 bg-red-950/30 border border-red-900/50 rounded-lg">
                            {err}
                        </div>
                    )}
                </form>

                <div className="mt-12 pt-6 border-t border-white/5 text-center">
                    <p className="text-[10px] text-[#9aa6bd]/40 uppercase tracking-[0.2em]">Chero Restaurant System v1.0</p>
                </div>
            </div>
        </div>
    );
}

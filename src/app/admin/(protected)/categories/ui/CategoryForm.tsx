"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/lib/menuStore";
import AdminLocaleSwitch from "../../ui/AdminLocaleSwitch";

export default function CategoryForm({ mode, initial }: { mode: "new" | "edit"; initial: Category }) {
    const [v, setV] = useState<Category>(initial);
    const [busy, setBusy] = useState(false);
    const router = useRouter();

    async function save(e: React.FormEvent) {
        e.preventDefault();
        setBusy(true);

        const r = await fetch("/api/admin/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(v),
        });

        setBusy(false);

        if (!r.ok) {
            const j = await r.json().catch(() => ({}));
            alert(j?.error ?? "Save failed");
            return;
        }


        router.push("/admin/categories");
        router.refresh();
    }

    return (
        <div style={{ maxWidth: 760 }}>
            <form onSubmit={save} style={{ display: "grid", gap: 12 }}>
                <div className="flex justify-between items-center gap-3 sticky top-0 z-20 bg-[#0b0d12]/95 backdrop-blur-md p-4 -mx-6 md:-mx-10 rounded-b-2xl border-b border-white/5 shadow-md mb-4">
                    <h1 className="text-2xl font-serif text-white m-0">
                        {mode === "new" ? "New Category" : `Edit Category: ${initial.id}`}
                    </h1>
                    <div className="flex gap-4 items-center">
                        <AdminLocaleSwitch />
                        <div className="w-[1px] h-6 bg-white/10 hidden md:block"></div>
                        <button type="button" onClick={() => router.push("/admin/categories")} className="btn">
                            Cancel
                        </button>
                        <button disabled={busy} type="submit" className="btn btnPrimary">
                            {busy ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>

                <div style={{ display: "grid", gap: 6 }}>
                    <div style={{ opacity: 0.8 }}>ID</div>
                    <code style={{ padding: 10, border: "1px solid var(--border)", borderRadius: 10 }}>{v.id}</code>
                </div>

                <label>
                    Status
                    <select value={v.status} onChange={(e) => setV({ ...v, status: e.target.value as any })} style={{ padding: 10 }}>
                        <option value="active">active</option>
                        <option value="hidden">hidden</option>
                    </select>
                </label>

                <fieldset style={{ border: "1px solid #eee", padding: 12 }}>
                    <legend>Titles</legend>
                    <label>KA<input value={v.title.ka} onChange={(e) => setV({ ...v, title: { ...v.title, ka: e.target.value } })} style={{ width: "100%", padding: 10 }} /></label>
                    <label>EN<input value={v.title.en} onChange={(e) => setV({ ...v, title: { ...v.title, en: e.target.value } })} style={{ width: "100%", padding: 10 }} /></label>
                    <label>RU<input value={v.title.ru} onChange={(e) => setV({ ...v, title: { ...v.title, ru: e.target.value } })} style={{ width: "100%", padding: 10 }} /></label>
                </fieldset>

            </form>
        </div >
    );
}

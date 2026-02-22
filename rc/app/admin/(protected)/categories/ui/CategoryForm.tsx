"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/lib/menuStore";

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
            alert("Save failed");
            return;
        }

        router.push("/admin/categories");
        router.refresh();
    }

    return (
        <div style={{ maxWidth: 760 }}>
            <h1>{mode === "new" ? "New Category" : `Edit Category: ${initial.id}`}</h1>

            <form onSubmit={save} style={{ display: "grid", gap: 12 }}>
                <label>
                    ID
                    <input
                        value={v.id}
                        disabled={mode === "edit"}
                        onChange={(e) => setV({ ...v, id: e.target.value.trim() })}
                        style={{ width: "100%", padding: 10 }}
                        placeholder="cat_khinkali"
                    />
                </label>

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

                <button disabled={busy} style={{ padding: 10 }}>
                    {busy ? "Saving..." : "Save"}
                </button>
            </form>
        </div>
    );
}

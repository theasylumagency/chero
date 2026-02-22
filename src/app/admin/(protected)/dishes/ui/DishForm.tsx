"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Category, Dish } from "@/lib/menuStore";
import DishPhotoUploader from "./DishPhotoUploader";

export default function DishForm({
    mode,
    initial,
    categories,
}: {
    mode: "new" | "edit";
    initial: Dish;
    categories: Category[];
}) {
    const [v, setV] = useState(() => ({
        ...initial,
        title: initial.title ?? { ka: "", en: "", ru: "" },
        description: initial.description ?? { ka: "", en: "", ru: "" },

        vegetarian: initial.vegetarian ?? false,
        topRated: initial.topRated ?? false,
        soldOut: initial.soldOut ?? false,
        story: initial.story ?? { ka: "", en: "", ru: "" },
    }));


    const [priceStr, setPriceStr] = useState((initial.priceMinor / 100).toFixed(2));

    const [busy, setBusy] = useState(false);
    const router = useRouter();

    const sortedCats = useMemo(() => [...categories].sort((a, b) => a.order - b.order), [categories]);

    async function save(e: React.FormEvent) {
        e.preventDefault();
        setBusy(true);

        const priceMinor = Math.round(parseFloat(priceStr || "0") * 100);
        const payload: Dish = {
            ...v,
            vegetarian: v.vegetarian ?? false,
            topRated: v.topRated ?? false,
            soldOut: v.soldOut ?? false,
            story: v.story ?? { ka: "", en: "", ru: "" },
            priceMinor: Number.isFinite(priceMinor) ? priceMinor : 0
        };

        const r = await fetch("/api/admin/dishes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        setBusy(false);

        if (!r.ok) {
            const j = await r.json().catch(() => ({}));
            alert(j?.error ?? "Save failed");
            return;
        }


        router.push("/admin/dishes");
        router.refresh();
    }

    return (
        <div style={{ maxWidth: 900 }}>
            <h1>{mode === "new" ? "New Dish" : `Edit Dish: ${v.id}`}</h1>

            <form onSubmit={save} style={{ display: "grid", gap: 12 }}>
                <div style={{ display: "grid", gap: 8 }}>
                    <strong>ID:</strong> <code>{v.id}</code>
                </div>

                <label>
                    Category
                    <div>
                        <div style={{ marginBottom: 8, opacity: 0.8 }}>Category</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {sortedCats.map((c) => {
                                const active = v.categoryId === c.id;
                                return (
                                    <button
                                        key={c.id}
                                        type="button"
                                        className="pill"
                                        data-active={active ? "true" : "false"}
                                        onClick={() => setV({ ...v, categoryId: c.id })}
                                    >
                                        {c.title.ka || c.id}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                </label>

                <label>
                    Status
                    <select value={v.status} onChange={(e) => setV({ ...v, status: e.target.value as any })} style={{ padding: 10 }}>
                        <option value="active">active</option>
                        <option value="hidden">hidden</option>
                    </select>
                </label>

                <label>
                    Price (GEL)
                    <input
                        value={priceStr}
                        onChange={(e) => setPriceStr(e.target.value)}
                        inputMode="decimal"
                        style={{ width: 220, padding: 10 }}
                        placeholder="18.90"
                    />
                </label>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    <label className="pill" style={{ cursor: "pointer" }}>
                        <input
                            type="checkbox"
                            checked={v.vegetarian}
                            onChange={(e) => setV({ ...v, vegetarian: e.target.checked })}
                            style={{ marginRight: 8 }}
                        />
                        Vegetarian
                    </label>

                    <label className="pill" style={{ cursor: "pointer" }}>
                        <input
                            type="checkbox"
                            checked={v.topRated}
                            onChange={(e) => setV({ ...v, topRated: e.target.checked })}
                            style={{ marginRight: 8 }}
                        />
                        Top rated
                    </label>

                    <label className="pill" style={{ cursor: "pointer" }}>
                        <input
                            type="checkbox"
                            checked={v.soldOut}
                            onChange={(e) => setV({ ...v, soldOut: e.target.checked })}
                            style={{ marginRight: 8 }}
                        />
                        Sold out
                    </label>
                </div>


                <fieldset style={{ border: "1px solid #eee", padding: 12, display: "grid", gap: 10 }}>
                    <legend>Title</legend>
                    <label>KA<input value={v.title.ka} onChange={(e) => setV({ ...v, title: { ...v.title, ka: e.target.value } })} style={{ width: "100%", padding: 10 }} /></label>
                    <label>EN<input value={v.title.en} onChange={(e) => setV({ ...v, title: { ...v.title, en: e.target.value } })} style={{ width: "100%", padding: 10 }} /></label>
                    <label>RU<input value={v.title.ru} onChange={(e) => setV({ ...v, title: { ...v.title, ru: e.target.value } })} style={{ width: "100%", padding: 10 }} /></label>
                </fieldset>

                <fieldset style={{ border: "1px solid #eee", padding: 12, display: "grid", gap: 10 }}>
                    <legend>Description</legend>
                    <label>KA<textarea value={v.description.ka} onChange={(e) => setV({ ...v, description: { ...v.description, ka: e.target.value } })} style={{ width: "100%", padding: 10, minHeight: 90 }} /></label>
                    <label>EN<textarea value={v.description.en} onChange={(e) => setV({ ...v, description: { ...v.description, en: e.target.value } })} style={{ width: "100%", padding: 10, minHeight: 90 }} /></label>
                    <label>RU<textarea value={v.description.ru} onChange={(e) => setV({ ...v, description: { ...v.description, ru: e.target.value } })} style={{ width: "100%", padding: 10, minHeight: 90 }} /></label>
                </fieldset>
                <fieldset style={{ padding: 12 }}>
                    <legend>Story</legend>

                    <div style={{ display: "grid", gap: 10 }}>
                        <div>
                            <div style={{ opacity: 0.8, marginBottom: 6 }}>KA</div>
                            <textarea
                                rows={4}
                                value={v.story.ka}
                                onChange={(e) => setV({ ...v, story: { ...v.story, ka: e.target.value } })}
                                style={{ width: "100%", padding: 10, minHeight: 90 }}
                            />

                        </div>

                        <div>
                            <div style={{ opacity: 0.8, marginBottom: 6 }}>EN</div>
                            <textarea
                                rows={4}
                                value={v.story.en}
                                onChange={(e) => setV({ ...v, story: { ...v.story, en: e.target.value } })}
                            />
                        </div>

                        <div>
                            <div style={{ opacity: 0.8, marginBottom: 6 }}>RU</div>
                            <textarea
                                rows={4}
                                value={v.story.ru}
                                onChange={(e) => setV({ ...v, story: { ...v.story, ru: e.target.value } })}
                            />
                        </div>
                    </div>
                </fieldset>

                <div style={{ border: "1px solid #eee", padding: 12 }}>
                    <h3>Photo (16:9)</h3>
                    <DishPhotoUploader dishId={v.id} current={v.photo ?? null} />
                    <p style={{ color: "#666", marginTop: 8 }}>
                        Upload → crop 16:9 → server saves WebP 1600×900 + 800×450 and stores filenames in dishes.json.
                    </p>
                </div>

                <button disabled={busy} style={{ padding: 10 }}>
                    {busy ? "Saving..." : "Save"}
                </button>
            </form>
        </div>
    );
}

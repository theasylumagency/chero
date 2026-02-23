"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Category, Dish, Lang } from "@/lib/menuStore";
import DishPhotoUploader from "./DishPhotoUploader";
import { useTranslations } from "next-intl";
import { useUnsavedChanges } from "../../ui/unsaved/UnsavedChangesProvider";

function tryAutoFillLabel(input: string): { en: string; ru: string } | null {
    if (!input) return null;
    const match = input.trim().match(/^([\d.,]+)\s*(ლ|მლ|გ|გრ|კგ|l|ml|g|kg)\.?$/i);
    if (!match) return null;

    const num = match[1];
    const unit = match[2].toLowerCase();

    if (unit === "ლ" || unit === "l") return { en: `${num} L`, ru: `${num} л` };
    if (unit === "მლ" || unit === "ml") return { en: `${num} ml`, ru: `${num} мл` };
    if (unit === "გ" || unit === "გრ" || unit === "g") return { en: `${num} g`, ru: `${num} г` };
    if (unit === "კგ" || unit === "kg") return { en: `${num} kg`, ru: `${num} кг` };

    return null;
}

function handleKaLabelChange(
    val: string,
    currentLabel: Record<Lang, string>,
    setter: (l: Record<Lang, string>) => void
) {
    const prevAuto = tryAutoFillLabel(currentLabel.ka);
    const newAuto = tryAutoFillLabel(val);

    if (newAuto) {
        setter({
            ka: val,
            en: (!currentLabel.en || (prevAuto && currentLabel.en === prevAuto.en)) ? newAuto.en : currentLabel.en,
            ru: (!currentLabel.ru || (prevAuto && currentLabel.ru === prevAuto.ru)) ? newAuto.ru : currentLabel.ru,
        });
    } else {
        setter({ ...currentLabel, ka: val });
    }
}

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
        chefsPick: initial.chefsPick ?? false,
        soldOut: initial.soldOut ?? false,
        story: initial.story ?? { ka: "", en: "", ru: "" },
    }));

    const [priceStr, setPriceStr] = useState((initial.priceMinor / 100).toFixed(2));
    const [priceLabel, setPriceLabel] = useState<Record<Lang, string>>(initial.priceLabel ?? { ka: "", en: "", ru: "" });
    const [variants, setVariants] = useState<{ priceStr: string; label: Record<Lang, string> }[]>(
        (initial.priceVariants ?? []).map(v => ({
            priceStr: (v.priceMinor / 100).toFixed(2),
            label: v.label,
        }))
    );

    const [busy, setBusy] = useState(false);
    const router = useRouter();
    const t = useTranslations("admin.dishForm");
    const { toast } = useUnsavedChanges();

    const sortedCats = useMemo(() => [...categories].sort((a, b) => a.order - b.order), [categories]);

    async function save(e: React.FormEvent) {
        e.preventDefault();
        setBusy(true);

        const priceMinor = Math.round(parseFloat(priceStr || "0") * 100);
        const payload: Dish = {
            ...v,
            vegetarian: v.vegetarian ?? false,
            topRated: v.topRated ?? false,
            chefsPick: v.chefsPick ?? false,
            soldOut: v.soldOut ?? false,
            story: v.story ?? { ka: "", en: "", ru: "" },
            priceMinor: Number.isFinite(priceMinor) ? priceMinor : 0,
            priceLabel: priceLabel,
            priceVariants: variants.map(v => ({
                priceMinor: Math.round(parseFloat(v.priceStr || "0") * 100),
                label: v.label
            }))
        };

        const r = await fetch("/api/admin/dishes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        setBusy(false);

        if (!r.ok) {
            const j = await r.json().catch(() => ({}));
            toast(j?.error ?? t("saveFailed"), "error");
            return;
        }


        router.push(`/admin/dishes${v.categoryId ? `?category=${v.categoryId}` : ''}`);
        router.refresh();
    }

    return (
        <div style={{ maxWidth: 900, position: "relative" }}>
            <form onSubmit={save} style={{ display: "grid", gap: 12 }}>
                <div style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    background: "rgba(11, 13, 18, 0.85)",
                    backdropFilter: "blur(12px)",
                    padding: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    margin: "-18px -18px 16px -18px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)"
                }}>
                    <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#e9eef7" }}>
                        {mode === "new" ? t("newDish") : `${t("editDish")} ${v.id}`}
                    </h1>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button type="button" onClick={() => router.push(`/admin/dishes${v.categoryId ? `?category=${v.categoryId}` : ''}`)} className="btn">
                            {t("cancel")}
                        </button>
                        <button disabled={busy} type="submit" className="btn btnPrimary">
                            {busy ? "..." : t("save")}
                        </button>
                    </div>
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                    <strong>{t("id")}:</strong> <code>{v.id}</code>
                </div>

                <label>
                    {t("category")}
                    <div>
                        <div style={{ marginBottom: 8, opacity: 0.8 }}>{t("category")}</div>
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
                    {t("status")}
                    <select value={v.status} onChange={(e) => setV({ ...v, status: e.target.value as any })} style={{ padding: 10 }}>
                        <option value="active">{t("active")}</option>
                        <option value="hidden">{t("hidden")}</option>
                    </select>
                </label>

                <fieldset style={{ border: "1px solid #eee", padding: 12, display: "grid", gap: 10 }}>
                    <legend>{t("pricesAndVariants")}</legend>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: 4 }}>{t("mainPrice")}</label>
                            <input
                                value={priceStr}
                                onChange={(e) => setPriceStr(e.target.value)}
                                inputMode="decimal"
                                style={{ width: "100%", padding: 10 }}
                                placeholder="18.90"
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: "block", marginBottom: 4 }}>{t("mainPriceLabel")}</label>
                        <div style={{ display: "flex", gap: 6 }}>
                            <input placeholder="KA" value={priceLabel.ka} onChange={(e) => handleKaLabelChange(e.target.value, priceLabel, setPriceLabel)} style={{ flex: 1, padding: 8 }} />
                            <input placeholder="EN" value={priceLabel.en} onChange={(e) => setPriceLabel({ ...priceLabel, en: e.target.value })} style={{ flex: 1, padding: 8 }} />
                            <input placeholder="RU" value={priceLabel.ru} onChange={(e) => setPriceLabel({ ...priceLabel, ru: e.target.value })} style={{ flex: 1, padding: 8 }} />
                        </div>
                    </div>

                    <hr style={{ margin: "10px 0", borderTop: "1px dashed #ccc" }} />
                    <div style={{ opacity: 0.8, fontSize: 14 }}>{t("additionalPrices")}</div>
                    {variants.map((vVariant, idx) => (
                        <div key={idx} style={{ padding: 10, background: "rgba(0,0,0,0.05)", borderRadius: 6, display: "grid", gap: 8 }}>
                            <div style={{ display: "flex", gap: 10, justifyContent: "space-between", alignItems: "center" }}>
                                <strong>{t("variant")} {idx + 1}</strong>
                                <button type="button" onClick={() => setVariants(variants.filter((_, i) => i !== idx))} style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}>{t("remove")}</button>
                            </div>
                            <input
                                value={vVariant.priceStr}
                                onChange={(e) => {
                                    const next = [...variants];
                                    next[idx].priceStr = e.target.value;
                                    setVariants(next);
                                }}
                                inputMode="decimal"
                                style={{ width: 120, padding: 8 }}
                                placeholder="Price"
                            />
                            <div style={{ display: "flex", gap: 6 }}>
                                <input placeholder="KA Label" value={vVariant.label.ka} onChange={(e) => {
                                    handleKaLabelChange(e.target.value, vVariant.label, (newLabel) => {
                                        const next = [...variants];
                                        next[idx].label = newLabel;
                                        setVariants(next);
                                    });
                                }} style={{ flex: 1, padding: 8 }} />
                                <input placeholder="EN Label" value={vVariant.label.en} onChange={(e) => { const next = [...variants]; next[idx].label.en = e.target.value; setVariants(next); }} style={{ flex: 1, padding: 8 }} />
                                <input placeholder="RU Label" value={vVariant.label.ru} onChange={(e) => { const next = [...variants]; next[idx].label.ru = e.target.value; setVariants(next); }} style={{ flex: 1, padding: 8 }} />
                            </div>
                        </div>
                    ))}
                    {variants.length < 5 && (
                        <button type="button" onClick={() => setVariants([...variants, { priceStr: "", label: { ka: "", en: "", ru: "" } }])} style={{ padding: 8, marginTop: 4 }}>
                            {t("addPriceVariant")}
                        </button>
                    )}
                </fieldset>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    <label className="pill" style={{ cursor: "pointer" }}>
                        <input
                            type="checkbox"
                            checked={v.vegetarian}
                            onChange={(e) => setV({ ...v, vegetarian: e.target.checked })}
                            style={{ marginRight: 8 }}
                        />
                        {t("vegetarian")}
                    </label>

                    <label className="pill" style={{ cursor: "pointer" }}>
                        <input
                            type="checkbox"
                            checked={v.topRated}
                            onChange={(e) => setV({ ...v, topRated: e.target.checked })}
                            style={{ marginRight: 8 }}
                        />
                        {t("bestseller")}
                    </label>

                    <label className="pill" style={{ cursor: "pointer" }}>
                        <input
                            type="checkbox"
                            checked={v.chefsPick}
                            onChange={(e) => setV({ ...v, chefsPick: e.target.checked })}
                            style={{ marginRight: 8 }}
                        />
                        {t("chefsPick")}
                    </label>

                    <label className="pill" style={{ cursor: "pointer" }}>
                        <input
                            type="checkbox"
                            checked={v.soldOut}
                            onChange={(e) => setV({ ...v, soldOut: e.target.checked })}
                            style={{ marginRight: 8 }}
                        />
                        {t("soldOut")}
                    </label>
                </div>


                <fieldset style={{ border: "1px solid #eee", padding: 12, display: "grid", gap: 10 }}>
                    <legend>{t("title")}</legend>
                    <label>KA<input value={v.title.ka} onChange={(e) => setV({ ...v, title: { ...v.title, ka: e.target.value } })} style={{ width: "100%", padding: 10 }} /></label>
                    <label>EN<input value={v.title.en} onChange={(e) => setV({ ...v, title: { ...v.title, en: e.target.value } })} style={{ width: "100%", padding: 10 }} /></label>
                    <label>RU<input value={v.title.ru} onChange={(e) => setV({ ...v, title: { ...v.title, ru: e.target.value } })} style={{ width: "100%", padding: 10 }} /></label>
                </fieldset>

                <fieldset style={{ border: "1px solid #eee", padding: 12, display: "grid", gap: 10 }}>
                    <legend>{t("description")}</legend>
                    <label>KA<textarea value={v.description.ka} onChange={(e) => setV({ ...v, description: { ...v.description, ka: e.target.value } })} style={{ width: "100%", padding: 10, minHeight: 90 }} /></label>
                    <label>EN<textarea value={v.description.en} onChange={(e) => setV({ ...v, description: { ...v.description, en: e.target.value } })} style={{ width: "100%", padding: 10, minHeight: 90 }} /></label>
                    <label>RU<textarea value={v.description.ru} onChange={(e) => setV({ ...v, description: { ...v.description, ru: e.target.value } })} style={{ width: "100%", padding: 10, minHeight: 90 }} /></label>
                </fieldset>
                <fieldset style={{ padding: 12 }}>
                    <legend>{t("story")}</legend>

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
            </form>
        </div>
    );
}

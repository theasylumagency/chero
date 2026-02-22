"use client";

import { useEffect, useMemo, useState } from "react";
import type { Category, Dish, Lang } from "@/lib/menuStore";
import SortableList from "../../ui/SortableList";
import { useUnsavedChanges } from "../../ui/unsaved/UnsavedChangesProvider";
import GuardedLink from "../../ui/unsaved/GuardedLink";

type SnapshotRow = { id: string; order: number; status: "active" | "hidden" };

function snapshotForCategory(all: Dish[], categoryId: string): SnapshotRow[] {
    return all
        .filter((d) => d.categoryId === categoryId)
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((d) => ({ id: d.id, order: d.order, status: d.status }));
}

function sameSnapshot(a: SnapshotRow[], b: SnapshotRow[]) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i].id !== b[i].id) return false;
        if (a[i].order !== b[i].order) return false;
        if (a[i].status !== b[i].status) return false;
    }
    return true;
}

function normalizeOrder(list: Dish[]) {
    return list.map((d, i) => ({ ...d, order: (i + 1) * 10 }));
}

export default function DishesClient({ categories, dishes }: { categories: Category[]; dishes: Dish[] }) {
    const { setDirty: setGlobalDirty, promptUnsaved, confirm, alert } = useUnsavedChanges();

    const catsSorted = useMemo(() => [...categories].sort((a, b) => a.order - b.order), [categories]);

    const [lang, setLang] = useState<Lang>("ka");
    const [catId, setCatId] = useState(catsSorted[0]?.id ?? "");
    const [items, setItems] = useState<Dish[]>(dishes);
    const [saving, setSaving] = useState(false);

    // Baseline snapshot per category (ids/order/status)
    const [baselineMap, setBaselineMap] = useState<Record<string, SnapshotRow[]>>(() => {
        const m: Record<string, SnapshotRow[]> = {};
        for (const c of catsSorted) m[c.id] = snapshotForCategory(dishes, c.id);
        return m;
    });

    // Baseline full dish objects by id (for restoring deletions on discard)
    const [baselineById, setBaselineById] = useState<Record<string, Dish>>(() => {
        const m: Record<string, Dish> = {};
        for (const d of dishes) m[d.id] = d;
        return m;
    });

    const filtered = useMemo(() => {
        return items
            .filter((d) => d.categoryId === catId)
            .slice()
            .sort((a, b) => a.order - b.order);
    }, [items, catId]);

    const currentSnap = useMemo(() => snapshotForCategory(items, catId), [items, catId]);
    const baseSnap = useMemo(() => baselineMap[catId] ?? [], [baselineMap, catId]);
    const dirty = useMemo(() => !sameSnapshot(currentSnap, baseSnap), [currentSnap, baseSnap]);

    useEffect(() => {
        setGlobalDirty(dirty);
    }, [dirty, setGlobalDirty]);

    async function saveCurrentCategory(): Promise<boolean> {
        setSaving(true);

        const normalized = normalizeOrder(filtered);
        const payload: SnapshotRow[] = normalized.map((d) => ({ id: d.id, order: d.order, status: d.status }));

        const r = await fetch("/api/admin/dishes/bulk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ categoryId: catId, items: payload }),
        });

        setSaving(false);

        if (!r.ok) {
            const j = await r.json().catch(() => ({}));
            await alert({ title: "Save failed", message: j?.error ?? "Save failed" });
            return false;
        }

        // Apply normalized order/status to local state for this category
        const byId = new Map(payload.map((x) => [x.id, x]));
        setItems((prev) =>
            prev
                .filter((d) => d.categoryId !== catId || byId.has(d.id)) // keep only those in payload for this category
                .map((d) => {
                    if (d.categoryId !== catId) return d;
                    const u = byId.get(d.id)!;
                    return { ...d, order: u.order, status: u.status };
                })
        );

        // Update baseline snapshot
        setBaselineMap((prev) => ({ ...prev, [catId]: payload.slice().sort((a, b) => a.order - b.order) }));

        // Update baseline dish objects:
        // - remove deleted baseline dishes for this category
        // - update saved ones
        setBaselineById((prev) => {
            const next = { ...prev };
            const oldIds = new Set((baselineMap[catId] ?? []).map((x) => x.id));
            const keep = new Set(payload.map((x) => x.id));

            for (const id of oldIds) {
                if (!keep.has(id)) delete next[id];
            }

            // refresh objects from current items (best source for titles/prices/etc)
            const currentById = new Map(items.map((d) => [d.id, d]));
            for (const row of payload) {
                const full = currentById.get(row.id);
                if (full) next[row.id] = { ...full, order: row.order, status: row.status };
            }
            return next;
        });

        setGlobalDirty(false);
        return true;
    }

    function discardCurrentCategoryChanges() {
        const baseline = baselineMap[catId] ?? [];
        const rebuilt: Dish[] = baseline
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((row) => {
                const base = baselineById[row.id];
                // fallback: if somehow missing, keep a minimal object from current items
                const fallback = items.find((d) => d.id === row.id);
                const full = base ?? fallback;
                if (!full) return null as any;
                return { ...full, categoryId: catId, order: row.order, status: row.status };
            })
            .filter(Boolean);

        setItems((prev) => {
            const other = prev.filter((d) => d.categoryId !== catId);
            return [...other, ...rebuilt];
        });

        setGlobalDirty(false);
    }

    async function switchCategory(nextCatId: string) {
        if (nextCatId === catId) return;

        if (dirty) {
            const choice = await promptUnsaved({
                title: "Unsaved changes",
                message: "You changed the order/status/deletions of dishes in this category. Save before switching?",
                saveText: "Save & switch",
                discardText: "Switch without saving",
                cancelText: "Stay here",
            });

            if (choice === "cancel") return;

            if (choice === "save") {
                const ok = await saveCurrentCategory();
                if (!ok) return;
            } else if (choice === "discard") {
                discardCurrentCategoryChanges();
            }
        }

        setCatId(nextCatId);
    }

    function applyLocalOrder(nextOrdered: Dish[]) {
        const normalized = normalizeOrder(nextOrdered);
        const orderMap = new Map(normalized.map((d) => [d.id, d.order]));

        setItems((prev) =>
            prev.map((d) => (d.categoryId === catId && orderMap.has(d.id) ? { ...d, order: orderMap.get(d.id)! } : d))
        );
    }

    function toggleLocalStatus(id: string) {
        setItems((prev) =>
            prev.map((d) => (d.id === id ? { ...d, status: d.status === "active" ? "hidden" : "active" } : d))
        );
    }

    async function deleteLocalDish(id: string) {
        const ok = await confirm({
            title: "Delete dish?",
            message: "This will remove the dish after you press Save. You can restore older versions from Dashboard.",
            confirmText: "Delete",
            cancelText: "Cancel",
        });
        if (!ok) return;

        setItems((prev) => prev.filter((d) => d.id !== id));
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <h1>Dishes</h1>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <label>UI:</label>
                    <select value={lang} onChange={(e) => setLang(e.target.value as Lang)} style={{ width: 90 }}>
                        <option value="ka">KA</option>
                        <option value="en">EN</option>
                        <option value="ru">RU</option>
                    </select>

                    <GuardedLink className="btn" href="/admin/dishes/new" onSave={saveCurrentCategory}>
                        + Add
                    </GuardedLink>

                    <button className={`btn ${dirty ? "btnPrimary" : ""}`} onClick={saveCurrentCategory} disabled={!dirty || saving}>
                        {saving ? "Saving..." : dirty ? "Save" : "Saved"}
                    </button>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16, marginTop: 12 }}>
                {/* Category list (LEFT SIDE) */}
                <aside className="panel" style={{ padding: 12 }}>
                    <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>Categories</div>
                    <div style={{ display: "grid", gap: 6 }}>
                        {catsSorted.map((c) => {
                            const active = c.id === catId;
                            return (
                                <button
                                    key={c.id}
                                    type="button"
                                    className="pill"
                                    data-active={active ? "true" : "false"}
                                    onClick={() => switchCategory(c.id)}
                                    style={{ justifyContent: "flex-start" }}
                                >
                                    {c.title[lang] || c.id}
                                    {c.status === "hidden" ? <span style={{ marginLeft: 8, opacity: 0.7 }}>(hidden)</span> : null}
                                </button>
                            );
                        })}
                    </div>
                </aside>

                {/* Dishes list */}
                <section className="panel" style={{ padding: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 10 }}>
                        <div style={{ opacity: 0.8 }}>{dirty ? "Unsaved changes (press Save)" : "Drag & drop to reorder"}</div>
                        <div style={{ opacity: 0.7, fontSize: 12 }}>
                            Category: <strong>{catsSorted.find((c) => c.id === catId)?.title[lang] ?? catId}</strong>
                        </div>
                    </div>

                    <SortableList
                        items={filtered}
                        onReorder={(next) => applyLocalOrder(next)}
                        renderRow={(d, { isDragging, isOver, overPos, dragProps }) => (
                            <div
                                {...dragProps}
                                className="row"
                                style={{
                                    opacity: isDragging ? 0.6 : 1,
                                    display: "grid",
                                    gridTemplateColumns: "1fr 110px 120px 90px 90px",
                                    gap: 10,
                                    alignItems: "center",
                                    padding: 12,
                                    cursor: "grab",
                                    position: "relative",
                                }}
                            >
                                {isOver && overPos && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            left: 12,
                                            right: 12,
                                            height: 2,
                                            top: overPos === "before" ? 6 : undefined,
                                            bottom: overPos === "after" ? 6 : undefined,
                                            background: "rgba(183,199,255,.55)",
                                            borderRadius: 2,
                                            pointerEvents: "none",
                                        }}
                                    />
                                )}

                                <div>
                                    <div style={{ fontWeight: 700 }}>{d.title[lang] || "(empty)"}</div>
                                    <div style={{ opacity: 0.7, fontSize: 12 }}>{d.id}</div>
                                </div>

                                <button className="btn" type="button" draggable={false} onClick={() => toggleLocalStatus(d.id)}>
                                    {d.status}
                                </button>

                                <div style={{ textAlign: "right" }}>
                                    {(d.priceMinor / 100).toFixed(2)} {d.currency}
                                </div>

                                <GuardedLink className="btn" href={`/admin/dishes/edit/${d.id}`} onSave={saveCurrentCategory}>
                                    Edit
                                </GuardedLink>

                                <button className="btn" type="button" draggable={false} onClick={() => deleteLocalDish(d.id)}>
                                    Delete
                                </button>
                            </div>
                        )}
                    />
                </section>
            </div>
        </div>
    );
}

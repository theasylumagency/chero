"use client";

import { useEffect, useMemo, useState } from "react";
import type { Category, Lang } from "@/lib/menuStore";
import SortableList from "../../ui/SortableList";
import { useUnsavedChanges } from "../../ui/unsaved/UnsavedChangesProvider";
import GuardedLink from "../../ui/unsaved/GuardedLink";
import { useLocale } from "next-intl";
import AdminLocaleSwitch from "../../ui/AdminLocaleSwitch";

function normalizeOrder(list: Category[]) {
    return list.map((c, i) => ({ ...c, order: (i + 1) * 10 }));
}

type SnapshotRow = { id: string; order: number; status: "active" | "hidden" };

function snapshot(list: Category[]): SnapshotRow[] {
    return [...list]
        .sort((a, b) => a.order - b.order)
        .map((c) => ({ id: c.id, order: c.order, status: c.status }));
}

function same(a: SnapshotRow[], b: SnapshotRow[]) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i].id !== b[i].id) return false;
        if (a[i].order !== b[i].order) return false;
        if (a[i].status !== b[i].status) return false;
    }
    return true;
}

export default function CategoriesClient({
    initial,
    dishCounts,
}: {
    initial: Category[];
    dishCounts: Record<string, number>;
}) {
    const { setDirty: setGlobalDirty, confirm, alert } = useUnsavedChanges();

    const lang = useLocale() as Lang;
    const [items, setItems] = useState<Category[]>([...initial].sort((a, b) => a.order - b.order));
    const [saving, setSaving] = useState(false);

    const [baseline, setBaseline] = useState<SnapshotRow[]>(() => snapshot(initial));

    const sorted = useMemo(() => [...items].sort((a, b) => a.order - b.order), [items]);
    const dirty = useMemo(() => !same(snapshot(sorted), baseline), [sorted, baseline]);

    useEffect(() => {
        setGlobalDirty(dirty);
    }, [dirty, setGlobalDirty]);

    async function saveAll(): Promise<boolean> {
        setSaving(true);
        const normalized = normalizeOrder(sorted);

        const r = await fetch("/api/admin/categories/bulk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: normalized }),
        });

        setSaving(false);

        if (!r.ok) {
            const j = await r.json().catch(() => ({}));
            await alert({ title: "Save failed", message: j?.error ?? "Save failed" });
            return false;
        }

        setItems(normalized);
        setBaseline(snapshot(normalized));
        setGlobalDirty(false);
        return true;
    }

    function toggleLocalStatus(id: string) {
        setItems((prev) =>
            prev.map((c) => (c.id === id ? { ...c, status: c.status === "active" ? "hidden" : "active" } : c))
        );
    }

    async function requestDeleteCategory(id: string) {
        const count = dishCounts[id] ?? 0;
        if (count > 0) {
            await alert({
                title: "Cannot delete category",
                message: `This category contains ${count} dish(es). Move or delete those dishes first.`,
                buttonText: "Got it",
            });
            return;
        }

        const ok = await confirm({
            title: "Delete category?",
            message: "This will remove the category after you press Save. You can restore older versions from Dashboard.",
            confirmText: "Delete",
            cancelText: "Cancel",
        });
        if (!ok) return;

        setItems((prev) => prev.filter((c) => c.id !== id));
    }

    return (
        <div>
            <div className="flex justify-between items-center gap-3 sticky top-0 z-20 bg-[#0b0d12]/95 backdrop-blur-md p-4 -mx-4 lg:-mx-10 rounded-b-2xl border-b border-white/5 shadow-md">
                <h1 className="text-2xl font-serif text-white m-0">Categories</h1>

                <div className="flex gap-4 items-center">
                    <AdminLocaleSwitch />
                    <div className="w-[1px] h-6 bg-white/10 hidden md:block"></div>
                    <GuardedLink className="btn" href="/admin/categories/new" onSave={saveAll}>
                        + Add
                    </GuardedLink>

                    <button className={`btn ${dirty ? "btnPrimary" : ""}`} onClick={saveAll} disabled={!dirty || saving}>
                        {saving ? "Saving..." : dirty ? "Save" : "Saved"}
                    </button>
                </div>
            </div>

            <div className="panel" style={{ padding: 12, marginTop: 12 }}>
                <SortableList
                    items={sorted}
                    onReorder={(next) => {
                        setItems(normalizeOrder(next));
                    }}
                    renderRow={(c, { isDragging, isOver, overPos, dragProps }) => (
                        <div
                            {...dragProps}
                            className="row"
                            style={{
                                opacity: isDragging ? 0.6 : 1,
                                display: "grid",
                                gridTemplateColumns: "1fr 120px 90px 90px",
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
                                <div style={{ fontWeight: 700 }}>{c.title[lang] || "(empty)"}</div>
                                <div style={{ opacity: 0.7, fontSize: 12 }}>
                                    {c.id}
                                    {(dishCounts[c.id] ?? 0) > 0 ? (
                                        <span style={{ marginLeft: 8, opacity: 0.7 }}>• {(dishCounts[c.id] ?? 0)} dishes</span>
                                    ) : null}
                                </div>
                            </div>

                            <button className="btn" type="button" draggable={false} onClick={() => toggleLocalStatus(c.id)}>
                                {c.status}
                            </button>

                            <GuardedLink className="btn" href={`/admin/categories/edit/${c.id}`} onSave={saveAll}>
                                Edit
                            </GuardedLink>

                            <button className="btn" type="button" draggable={false} onClick={() => requestDeleteCategory(c.id)}>
                                Delete
                            </button>
                        </div>
                    )}
                />
            </div>
        </div>
    );
}

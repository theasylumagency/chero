"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import DishCard from "./DishCard";
import DishDetailsModal from "./DishDetailsModal";
import type { PublicCategory, PublicDish } from "./MenuPage";

function norm(s: string) {
    return (s || "").toLowerCase().trim();
}

export default function MenuClient({ menu }: { menu: PublicCategory[] }) {
    const t = useTranslations("menu.ui");

    const [q, setQ] = useState("");
    const [activeCat, setActiveCat] = useState(menu[0]?.id ?? "");
    const [openDish, setOpenDish] = useState<PublicDish | null>(null);

    const filtered = useMemo(() => {
        const query = norm(q);
        if (!query) return menu.filter((c) => c.dishes.length > 0);
        return menu
            .map((c) => ({
                ...c,
                dishes: c.dishes.filter((d) => {
                    const hay = `${d.title} ${d.description} ${d.story}`.toLowerCase();
                    return hay.includes(query);
                }),
            }))
            .filter((c) => c.dishes.length > 0);
    }, [menu, q]);

    useEffect(() => {
        if (!filtered.length) {
            setActiveCat("");
            return;
        }
        if (!activeCat || !filtered.some((c) => c.id === activeCat)) {
            setActiveCat(filtered[0].id);
        }
    }, [filtered, activeCat]);

    useEffect(() => {
        if (!filtered.length) return;

        const els = filtered
            .map((c) => document.getElementById(`cat-${c.id}`))
            .filter(Boolean) as HTMLElement[];

        if (!els.length) return;

        // Track visibility of all sections
        const visibilityMap = new Map<string, number>();

        const obs = new IntersectionObserver(
            (entries) => {
                let maxRatio = 0;
                let mostVisibleId = activeCat;

                entries.forEach((e) => {
                    const id = e.target.getAttribute("data-cat");
                    if (id) {
                        visibilityMap.set(id, e.intersectionRatio);
                    }
                });

                // Find the section taking up the most viewport space
                visibilityMap.forEach((ratio, id) => {
                    if (ratio > maxRatio) {
                        maxRatio = ratio;
                        mostVisibleId = id;
                    }
                });

                // Only update if a significant portion is visible to prevent flickering
                if (maxRatio > 0.1 && mostVisibleId !== activeCat) {
                    setActiveCat(mostVisibleId);
                }
            },
            {
                // Create multiple threshold points for better accuracy
                threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
                // Adjust margin to focus on the center of the screen
                rootMargin: "-20% 0px -40% 0px",
            }
        );

        els.forEach((el) => obs.observe(el));
        return () => obs.disconnect();
    }, [filtered, activeCat]);

    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 500);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    function scrollToCategory(id: string) {
        const el = document.getElementById(`cat-${id}`);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    const totalShown = useMemo(
        () => filtered.reduce((acc, c) => acc + c.dishes.length, 0),
        [filtered]
    );

    return (
        <section id="menu" className="relative min-h-screen bg-[#050B10] border-t border-white/[0.03]">
            {/* Ambient Background Glows */}
            <div
                aria-hidden
                className="pointer-events-none absolute left-[15%] top-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-chero-accent/opacity-10 blur-[150px] opacity-40 mix-blend-screen"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute right-[10%] top-[30%] h-[600px] w-[600px] translate-x-1/2 rounded-full bg-chero-accent/opacity-[0.05] blur-[120px] opacity-30 mix-blend-screen"
            />

            <div className="relative mx-auto max-w-[90rem] px-6 py-16 sm:py-24">
                {/* Header / Sticky Tools */}
                <div className="sticky top-0 z-40 -mx-6 bg-[#050B10]/80 px-6 py-6 backdrop-blur-xl border-b border-white/[0.03]">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mx-auto max-w-[90rem]">

                        {/* Elegant Search Pill */}
                        <div className="relative group w-full max-w-sm">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/[0.08] to-white/[0.02] p-[1px] opacity-70 transition-opacity group-focus-within:opacity-100">
                                <div className="h-full w-full rounded-full bg-[#0A151C]" />
                            </div>
                            <div className="relative flex w-full items-center gap-4 rounded-full px-5 py-3.5 shadow-inner">
                                <div className="text-[11px] tracking-[0.2em] text-chero-accent/60">⌕</div>
                                <input
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder={t("searchPlaceholder")}
                                    className="w-full bg-transparent text-sm font-light tracking-wide text-white/90 placeholder:text-white/40 focus:outline-none"
                                />
                                {q && (
                                    <button
                                        type="button"
                                        onClick={() => setQ("")}
                                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[9px] font-medium tracking-[0.2em] uppercase text-white/60 transition hover:bg-white/[0.08] hover:text-white"
                                    >
                                        {t("clear")}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Total Count */}
                        <div className="hidden md:flex items-center gap-3 opacity-60">
                            <div className="h-px w-8 bg-chero-accent/30" />
                            <div className="text-[10px] tracking-[0.3em] uppercase text-white/80 font-light">
                                {t("count", { count: totalShown })}
                            </div>
                        </div>

                        {/* Mobile Categories Scroll (Pinned) */}
                        {filtered.length > 0 && (
                            <div className="lg:hidden sticky top-[88px] z-30 -mx-6 bg-[#050B10]/95 backdrop-blur-xl border-b border-white/[0.03]">
                                <div className="flex items-center gap-4 overflow-x-auto px-6 py-4 scrollbar-hide snap-x">
                                    {filtered.map((c) => {
                                        const active = c.id === activeCat;
                                        return (
                                            <button
                                                key={c.id}
                                                type="button"
                                                onClick={() => scrollToCategory(c.id)}
                                                className={`relative shrink-0 snap-start text-[11px] font-medium tracking-[0.2em] uppercase transition-all duration-300 ${active ? "text-chero-accent" : "text-white/50 hover:text-white/80"
                                                    }`}
                                            >
                                                {c.title}
                                                {active && (
                                                    <div className="absolute -bottom-4 left-1/2 h-px w-2/3 -translate-x-1/2 bg-chero-accent" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-16 grid gap-16 lg:grid-cols-[240px_1fr] xl:grid-cols-[280px_1fr]">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block relative">
                        <div className="sticky top-40">
                            <h3 className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/40 mb-8 flex items-center gap-4">
                                <div className="h-px w-6 bg-white/20" />
                                {t("categories")}
                            </h3>
                            <nav className="flex flex-col gap-6 pl-8 border-l border-white/[0.05]">
                                {filtered.map((c) => {
                                    const active = c.id === activeCat;
                                    return (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => scrollToCategory(c.id)}
                                            className={`group relative flex w-full items-center justify-between text-left transition-all duration-500 ${active ? "translate-x-3" : "hover:translate-x-2"
                                                }`}
                                        >
                                            {/* Active Indicator Line */}
                                            <div
                                                className={`absolute -left-8 h-full w-[2px] rounded-r-full transition-all duration-500 ${active ? "bg-chero-accent scale-y-125" : "bg-transparent scale-y-50 group-hover:bg-white/20"
                                                    }`}
                                            />

                                            <span className={`text-sm tracking-wide ${active ? "font-serif text-2xl italic text-white" : "font-light text-white/60 group-hover:text-white/90"
                                                }`}>
                                                {c.title}
                                            </span>

                                            <span className={`text-[10px] font-light tracking-[0.2em] transition-colors ${active ? "text-chero-accent/80" : "text-white/30 group-hover:text-white/50"
                                                }`}>
                                                {String(c.dishes.length).padStart(2, '0')}
                                            </span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    <div className="space-y-24">
                        {filtered.length === 0 ? (
                            <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
                                <div className="text-[10px] uppercase tracking-[0.4em] text-chero-accent/60 mb-6">
                                    {t("noResultsTitle")}
                                </div>
                                <div className="font-serif text-3xl font-light tracking-wide text-white/90">
                                    {t("noResults")}
                                </div>
                                <button
                                    onClick={() => setQ("")}
                                    className="mt-10 group relative overflow-hidden rounded-full border border-white/10 bg-black/40 px-8 py-3.5"
                                >
                                    <div className="absolute inset-0 bg-chero-accent/10 translate-y-[100%] transition-transform duration-500 group-hover:translate-y-0" />
                                    <span className="relative z-10 text-[10px] font-medium tracking-[0.3em] uppercase text-white/80 group-hover:text-white transition-colors">
                                        {t("reset")}
                                    </span>
                                </button>
                            </div>
                        ) : (
                            filtered.map((c) => (
                                <section key={c.id} id={`cat-${c.id}`} data-cat={c.id} className="scroll-mt-48 group">
                                    <div className="mb-12 flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
                                        <div>
                                            <h2 className="font-serif text-4xl sm:text-5xl font-light tracking-wide text-white transition-colors group-hover:text-chero-accent/90">
                                                {c.title}
                                            </h2>
                                            <div className="mt-6 flex items-center justify-center sm:justify-start gap-4">
                                                <div className="h-[1px] w-12 bg-chero-accent/40" />
                                                <div className="h-[3px] w-[3px] rotate-45 bg-chero-accent/60" />
                                                <div className="h-[1px] w-12 bg-chero-accent/40" />
                                            </div>
                                        </div>
                                        <div className="mt-6 sm:mt-0 flex items-center gap-3 opacity-60">
                                            <div className="h-px w-8 bg-white/20 sm:hidden" />
                                            <span className="text-[10px] font-light uppercase tracking-[0.3em] text-white/70">
                                                {String(c.dishes.length).padStart(2, '0')} {t("items", { count: c.dishes.length }).split(' ')[1] || 'Items'}
                                            </span>
                                            <div className="h-px w-8 bg-white/20 sm:hidden" />
                                        </div>
                                    </div>

                                    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
                                        {c.dishes.map((d) => (
                                            <DishCard key={d.id} dish={d} onDetails={() => setOpenDish(d)} />
                                        ))}
                                    </div>
                                </section>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <DishDetailsModal dish={openDish} open={!!openDish} onClose={() => setOpenDish(null)} />

            {/* Back to Top Button */}
            <button
                onClick={scrollToTop}
                aria-label="Back to top"
                className={`fixed bottom-8 right-8 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#050B10]/80 text-chero-accent backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-500 hover:bg-white/[0.05] hover:scale-110 hover:border-chero-accent/30 ${showBackToTop ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
                    }`}
            >
                <div className="text-xl font-light">↑</div>
            </button>
        </section>
    );
}
"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { PublicDish } from "./MenuPage";

function formatPrice(priceMinor: number, currency: "GEL") {
    const v = priceMinor / 100;
    const s = v.toFixed(2).replace(/\.00$/, "");
    return currency === "GEL" ? `${s} ₾` : s;
}

export default function DishDetailsModal({
    dish,
    open,
    onClose,
}: {
    dish: PublicDish | null;
    open: boolean;
    onClose: () => void;
}) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open || !dish) return null;

    const soldOut = dish.soldOut;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop Glow & Blur */}
            <div
                aria-hidden
                onClick={onClose}
                className="absolute inset-0 bg-[#050B10]/90 backdrop-blur-2xl transition-all duration-700 ease-out"
            />
            {/* Ambient Accent Light */}
            <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-chero-accent/opacity-10 blur-[150px] mix-blend-screen"
            />

            <div className="relative flex h-full max-h-[90vh] w-full max-w-[85rem] flex-col md:flex-row overflow-hidden rounded-[2.5rem] md:rounded-[3rem] border border-white/[0.03] bg-[#050B10]/60 shadow-[0_0_100px_-20px_rgba(0,0,0,1)] animate-fade-in-up md:mx-6">

                {/* Close Button Top Right */}
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white/70 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
                    aria-label="Close"
                >
                    <span className="text-2xl font-light">×</span>
                </button>

                {/* Left Side: Immersive Image */}
                <div className="relative w-full md:w-1/2 lg:w-[60%] h-[40vh] md:h-full shrink-0 overflow-hidden">
                    {dish.photo?.full ? (
                        <Image
                            src={dish.photo.full}
                            alt={dish.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 60vw"
                            className={[
                                "object-cover transition-transform duration-[2s] ease-out scale-105",
                                soldOut ? "grayscale contrast-[0.9]" : "",
                            ].join(" ")}
                            priority
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent" />
                    )}

                    {/* Shadow Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050B10] via-transparent to-transparent opacity-80 md:hidden" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#050B10] opacity-80 hidden md:block" />

                    {/* Badges Over Image */}
                    <div className="absolute left-8 top-8 flex flex-wrap gap-3">
                        {soldOut ? (
                            <span className="rounded-full bg-black/40 px-5 py-2 text-[10px] font-medium tracking-[0.3em] uppercase text-white/80 backdrop-blur-md border border-white/10">
                                Sold out
                            </span>
                        ) : (
                            <>
                                {dish.topRated && (
                                    <span className="rounded-full bg-gradient-to-r from-chero-accent/90 to-chero-accent/70 px-5 py-2 text-[10px] font-semibold tracking-[0.3em] uppercase text-[#050B10] shadow-[0_4px_20px_rgba(204,168,118,0.3)] backdrop-blur-md">
                                        Chef’s pick
                                    </span>
                                )}
                                {dish.vegetarian && (
                                    <span className="rounded-full bg-black/40 px-5 py-2 text-[10px] font-medium tracking-[0.3em] uppercase text-white/80 backdrop-blur-md border border-white/10">
                                        Veg
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Right Side: Content & Story */}
                <div className="relative flex w-full md:w-1/2 lg:w-[40%] flex-col justify-between p-8 md:p-14 lg:p-20 overflow-y-auto custom-scrollbar">

                    <div>
                        <div className="flex flex-col gap-6">
                            <h2 className="font-serif text-4xl md:text-5xl lg:text-3xl font-light leading-tight tracking-wide text-white">
                                {dish.title}
                            </h2>

                            {!soldOut && (
                                <div className="flex items-center gap-6">
                                    <div className="h-px w-12 bg-chero-accent/50" />
                                    <div className="text-xl md:text-2xl font-light tracking-widest text-chero-accent">
                                        {formatPrice(dish.priceMinor, dish.currency)}
                                    </div>
                                </div>
                            )}
                        </div>

                        {dish.description && (
                            <p className="mt-8 text-base md:text-lg font-light leading-relaxed text-white/60">
                                {dish.description}
                            </p>
                        )}

                        <div className="mt-12">
                            <h3 className="flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.4em] text-white/30">
                                <span className="h-[2px] w-[2px] rounded-full bg-chero-accent" />
                                The Story
                            </h3>
                            {dish.story ? (
                                <p className="mt-6 text-sm md:text-base font-light leading-loose text-white/70">
                                    {dish.story}
                                </p>
                            ) : (
                                <p className="mt-6 text-sm font-light text-white/30 italic">
                                    A culinary creation waiting to be discovered.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-16 pt-12 border-t border-white/[0.05]">
                        {soldOut ? (
                            <div className="flex items-center gap-4 text-white/40">
                                <span className="text-xs font-medium tracking-[0.3em] uppercase">Status</span>
                                <div className="h-px w-8 bg-white/10" />
                                <span className="text-sm font-light italic">Currently unavailable</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 text-white/50">
                                {/* Optional: Pairings or Allergens */}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
"use client";

import Image from "next/image";
import type { PublicDish } from "./MenuPage";
import { useTranslations } from "next-intl";

function formatPrice(priceMinor: number, currency: "GEL") {
    const v = priceMinor / 100;
    const s = v.toFixed(2).replace(/\.00$/, "");
    return currency === "GEL" ? `${s} ₾` : s;
}

export default function DishCard({
    dish,
    onDetails,
}: {
    dish: PublicDish;
    onDetails: () => void;
}) {
    const soldOut = dish.soldOut;
    const t = useTranslations("menu.dishCard");

    return (
        <article
            className={[
                "group relative block overflow-hidden rounded-[2rem] bg-transparent transition-all duration-700",
                soldOut
                    ? "opacity-50 grayscale cursor-not-allowed"
                    : "cursor-pointer hover:-translate-y-1",
            ].join(" ")}
            onClick={soldOut ? undefined : onDetails}
            role={soldOut ? undefined : "button"}
            tabIndex={soldOut ? -1 : 0}
            onKeyDown={(e) => {
                if (!soldOut && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onDetails();
                }
            }}
        >
            {/* Soft Ambient Card Glow */}
            <div className={`absolute inset-0 rounded-[2rem] border border-white/[0.02] bg-white/[0.01] transition-all duration-700
                ${soldOut ? "" : "group-hover:bg-white/[0.03] group-hover:border-white/[0.08]"}`}
            />

            {/* 16:9 media area */}
            <div className="relative aspect-[4/3] sm:aspect-video w-full overflow-hidden rounded-[2rem] shadow-2xl">
                {dish.photo?.small ? (
                    <Image
                        src={dish.photo.small}
                        alt={dish.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className={[
                            "object-cover transition-transform duration-1000 ease-out",
                            soldOut ? "grayscale contrast-[0.9]" : "group-hover:scale-[1.05]",
                        ].join(" ")}
                        priority={false}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent" />
                )}

                {/* Soft Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050B10]/90 via-[#050B10]/20 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-60" />

                {/* Badges */}
                <div className="absolute left-6 top-6 flex flex-wrap gap-3">
                    {soldOut ? (
                        <span className="rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-[9px] font-medium tracking-[0.25em] uppercase text-white/60 backdrop-blur-md">
                            {t("soldOut")}
                        </span>
                    ) : (
                        <>
                            {dish.topRated && (
                                <span className="rounded-full bg-gradient-to-r from-chero-accent/90 to-chero-accent/70 px-4 py-1.5 text-[9px] font-semibold tracking-[0.25em] uppercase text-[#050B10] shadow-[0_4px_20px_rgba(204,168,118,0.3)] backdrop-blur-md">
                                    {t("bestseller")}
                                </span>
                            )}
                            {dish.chefsPick && (
                                <span className="rounded-full border border-chero-accent/50 bg-black/40 px-4 py-1.5 text-[9px] font-medium tracking-[0.25em] uppercase text-chero-accent backdrop-blur-md">
                                    {t("chefsPick")}
                                </span>
                            )}
                            {dish.vegetarian && (
                                <span className="rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-[9px] font-medium tracking-[0.25em] uppercase text-white/80 backdrop-blur-md">
                                    {t("veg")}
                                </span>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="relative p-6 px-4 sm:px-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-end justify-between gap-4">
                        <h3 className="font-serif text-lg font-light leading-snug tracking-wide text-white/90 transition-colors group-hover:text-white">
                            {dish.title}
                        </h3>

                        {!soldOut && (
                            <div className="flex flex-col items-end gap-1 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="hidden sm:block h-[1px] w-8 bg-white/10" />
                                    <div className="flex items-baseline gap-1.5 text-sm font-light tracking-wide text-chero-accent/90">
                                        {formatPrice(dish.priceMinor, dish.currency)}
                                        {dish.priceVariants?.length > 0 && <span className="text-chero-accent/60">+</span>}
                                        {dish.priceLabel && <span className="text-[10px] uppercase font-medium tracking-widest opacity-70"> • {dish.priceLabel}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <p className="line-clamp-2 text-sm font-light leading-relaxed text-white/50 group-hover:text-white/70 transition-colors min-h-[2.5rem]">
                        {dish.description || "—"}
                    </p>

                    <div className="mt-2 flex items-center justify-between opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                        {!soldOut ? (
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-chero-accent">
                                    {t("exploreDish")}
                                </span>
                                <div className="h-px w-6 bg-chero-accent/60" />
                            </div>
                        ) : (
                            <span className="text-[10px] tracking-[0.3em] uppercase text-white/30">
                                {t("unavailable")}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}
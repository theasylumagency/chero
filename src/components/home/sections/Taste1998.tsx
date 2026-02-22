"use client";

import { useTranslations } from "next-intl";

export default function Taste1998() {
    const t = useTranslations("home.taste");

    return (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32 overflow-hidden">
            {/* Massive Watermark */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 select-none text-[180px] sm:text-[300px] font-black tracking-tighter text-white/[0.02] pointer-events-none z-0">
                1998
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-20">
                {/* Decorative Line */}
                <div className="hidden md:block w-px h-32 bg-gradient-to-b from-transparent via-chero-accent/40 to-transparent" />

                <div className="flex-1 max-w-2xl">
                    <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight leading-tight">
                        {t("title")}
                    </h2>

                    <p className="mt-6 text-lg sm:text-xl text-white/70 leading-relaxed font-light">
                        {t("body")}
                    </p>

                    <div className="mt-10 flex items-center gap-4">
                        <div className="h-px w-12 bg-chero-accent/50" />
                        <span className="text-xs uppercase tracking-[0.2em] text-chero-accent">
                            Since 1998
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
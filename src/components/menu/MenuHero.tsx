"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import LocaleSwitch from "@/components/i18n/LocaleSwitch";

function clamp(n: number, a: number, b: number) {
    return Math.max(a, Math.min(b, n));
}

export default function MenuHero({ locale }: { locale: "ka" | "en" | "ru" }) {
    const t = useTranslations("menu.hero");
    const sectionRef = useRef<HTMLElement>(null);

    // 0..1 progress while hero is in/near viewport
    const [p, setP] = useState(0);

    const reduceMotion = useMemo(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    }, []);

    useEffect(() => {
        if (reduceMotion) return;

        let raf = 0;

        const recalc = () => {
            const el = sectionRef.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight || 1;

            // progress: 0 when hero just starts to enter, 1 when it's mostly passed
            const prog = clamp((vh - rect.top) / (vh + rect.height), 0, 1);
            setP(prog);
        };

        const onScroll = () => {
            if (raf) return;
            raf = window.requestAnimationFrame(() => {
                raf = 0;
                recalc();
            });
        };

        recalc();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [reduceMotion]);

    // gentle drift (tune these if you want stronger/weaker)
    const desktopY = reduceMotion ? 0 : Math.round((p - 0.2) * -36); // up a bit while scrolling
    const mobileY = reduceMotion ? 0 : Math.round((p - 0.2) * -18);

    const desktopScale = reduceMotion ? 1 : 1.02 + p * 0.02;

    return (
        <section ref={sectionRef} className="sticky top-0 overflow-hidden border-b border-white/10">
            {/* base */}
            {/* image layer */}
            <div aria-hidden className="absolute inset-0">
                {/* desktop image */}
                <div
                    className="absolute -right-0 top-0 hidden md:block h-[110%] w-[100vw]"
                >
                    <Image
                        src="/menu/canopy-sketch.webp"
                        alt=""
                        fill
                        priority
                        className="object-contain opacity-[1]"
                        sizes="(max-width: 1024px) 0px, 100vw"
                    />
                </div>

                {/* mobile image */}
                <div
                    className="absolute inset-x-0 -top-2 md:hidden h-[280px] will-change-transform"
                >
                    <Image
                        src="/menu/canopy-sketch-mobile.webp"
                        alt=""
                        fill
                        priority
                        className="object-cover opacity-[0.55]"
                        sizes="100vw"
                    />
                </div>

                {/* vignette */}
                <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-[#071018]" />
                <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_0%_40%,rgba(0,0,0,0.65),transparent_55%)]" />
            </div>
            <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(20,40,55,0.85),rgba(5,11,16,1)_70%)]"
            />

            {/* blueprint grid */}
            <div
                aria-hidden
                className="absolute inset-0 opacity-[1] mix-blend-overlay"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.10) 1px, transparent 1px)",
                    backgroundSize: "64px 64px",
                }}
            />



            {/* header */}
            <div className="relative z-10 mx-auto max-w-7xl px-6 pt-6">
                <div className="flex items-center justify-between">
                    <a
                        href={`/${locale}`}
                        className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur transition hover:bg-white/10"
                    >
                        <Image
                            src="/brand/logo-white.svg"
                            alt="Chero"
                            width={120}
                            height={50}
                            className="h-auto w-[92px] opacity-90 transition group-hover:opacity-100"
                        />
                        {/* logo text 
                        <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 group-hover:text-white/80">
                            {t("back")}
                        </span>

                        */}
                    </a>

                    <LocaleSwitch />
                </div>
            </div>

            {/* hero copy */}
            <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-10 md:pb-20 md:pt-16">
                <div className="grid items-end gap-10 lg:grid-cols-2">
                    <div className="max-w-xl">
                        <div className="text-[10px] uppercase tracking-[0.35em] text-white/55">
                            {t("kicker")}
                        </div>
                        <h1 className="mt-4 font-serif text-4xl leading-[1.08] tracking-tight sm:text-5xl">
                            {t("title")}
                        </h1>
                        <p className="mt-5 text-base leading-relaxed text-white/78 sm:text-lg">
                            {t("subtitle")}
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <a
                                href="#menu"
                                className="group relative overflow-hidden rounded-full bg-[#CCA876] px-6 py-3 text-xs font-semibold tracking-widest uppercase text-[#050B10] shadow-[0_0_40px_-12px_rgba(204,168,118,0.55)] transition hover:scale-[1.02]"
                            >
                                <span className="relative z-10">{t("cta")}</span>
                                <div className="absolute inset-0 translate-y-[100%] bg-white/20 transition-transform duration-300 group-hover:translate-y-0" />
                            </a>
                            {/* additional button 
                            <div className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-xs tracking-widest text-white/70 backdrop-blur">
                                {t("hours")}
                            </div>
                            */}
                        </div>
                    </div>

                    <div className="hidden lg:block" />
                </div>
            </div>
        </section>
    );
}
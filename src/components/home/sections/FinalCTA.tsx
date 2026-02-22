"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
export default function FinalCTA() {
    const t = useTranslations("home.final");
    const locale = useLocale();
    return (
        <section className="relative overflow-hidden bg-[#071018]">
            {/* Background Image with premium cinematic blend */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <Image
                    src="/photos/kobuleti-sunset.webp"
                    alt="Kobuleti Sunset"
                    fill
                    className="object-cover object-[center_60%] opacity-60 mix-blend-luminosity brightness-75 scale-105"
                />
                <div className="absolute inset-0 bg-black/20" /> {/* Slight darkening mask */}
            </div>

            {/* Deep gradient to seamlessly blend the image into the dark aesthetic */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#071018] via-[#071018]/80 to-transparent pointer-events-none z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(204,168,118,0.15)_0%,transparent_80%)] translate-y-[20%] pointer-events-none z-0" />
            <div className="absolute inset-0 opacity-[0.15] hero-noise pointer-events-none mix-blend-overlay z-0" />

            <div className="relative mx-auto max-w-5xl px-6 py-32 sm:py-48 text-center z-10">
                <div className="relative">
                    <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-white tracking-tighter leading-[1.1] drop-shadow-2xl">
                        {t("line")}
                    </h2>

                    <div className="mt-16 flex flex-wrap items-center justify-center gap-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                        <a
                            href={`/${locale}/menu`}
                            className="group relative overflow-hidden rounded-full bg-white px-10 py-5 text-xs font-semibold uppercase tracking-widest text-[#050B10] shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all duration-500 hover:scale-105 hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.5)]"
                        >
                            <span className="relative z-10">{t("menu")}</span>
                            <div className="absolute inset-0 translate-y-[100%] bg-[#CCA876] transition-transform duration-300 group-hover:translate-y-0" />
                        </a>

                        <a
                            href="#location"
                            className="group rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-10 py-5 text-xs font-semibold uppercase tracking-widest text-white/90 transition-all duration-500 hover:bg-white/10 hover:border-white/40 hover:scale-105"
                        >
                            {t("directions")}
                        </a>

                        <a
                            href="tel:+995599616168"
                            className="group rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-10 py-5 text-xs font-semibold uppercase tracking-widest text-white/90 transition-all duration-500 hover:bg-white/10 hover:border-white/40 hover:scale-105"
                        >
                            {t("call")}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
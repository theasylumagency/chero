"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

export default function FinalCTA() {
    const t = useTranslations("home.final");
    const locale = useLocale();

    return (
        <section className="relative overflow-hidden bg-[#071018] font-serif py-24 sm:py-32 lg:py-40 selection:bg-[#CCA876]/30 selection:text-white">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 bg-[#03070A] pointer-events-none z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(204,168,118,0.08)_0%,transparent_60%)] pointer-events-none z-0" />
            {/* Dark vignette to blend with other sections */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(3,7,10,0.8)_100%)] pointer-events-none z-0" />
            <div className="absolute inset-0 opacity-[0.25] hero-noise pointer-events-none mix-blend-overlay z-0" />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-20 z-10">

                {/* LEFT CONTENT (Text & Buttons) */}
                <div className="flex-1 text-center lg:text-left animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <h2 className={`text-4xl ${locale === 'ka' ? 'sm:leading-[1.4] md:leading-[1.4] lg:leading-[1.5] sm:text-3xl/8 md:text-4xl lg:text-5xl' : 'sm:text-5xl md:text-6xl lg:text-7xl '} font-serif text-white tracking-tighter leading-[1.1] drop-shadow-2xl mb-8`}>
                        {t("line").split('\n').map((line, i) => (
                            <span key={i} className="block">{line}</span>
                        ))}
                    </h2>

                    <p className="text-white/60 text-sm sm:text-base lg:text-lg font-sans font-light tracking-wide leading-relaxed max-w-xl mx-auto lg:mx-0 mb-12 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                        {t("body")}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 w-full max-w-xl mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                        <a
                            href={`/${locale}/menu`}
                            className="w-full sm:w-auto text-center group relative overflow-hidden rounded-sm bg-[#CCA876] px-10 py-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#050B10] shadow-[0_0_40px_-10px_rgba(204,168,118,0.3)] transition-all duration-500 hover:shadow-[0_0_60px_-10px_rgba(204,168,118,0.6)] hover:-translate-y-1"
                        >
                            <span className="relative z-10">{t("menu")}</span>
                            <div className="absolute inset-0 translate-y-[100%] bg-white/20 transition-transform duration-500 ease-out group-hover:translate-y-0" />
                        </a>

                        <a
                            href="#location"
                            className="w-full sm:w-auto text-center group rounded-sm border border-white/20 bg-transparent px-10 py-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 transition-all duration-500 hover:bg-white/5 hover:border-[#CCA876]/50 hover:-translate-y-1"
                        >
                            {t("directions")}
                        </a>

                        <a
                            href="tel:+995599616168"
                            className="w-full sm:w-auto text-center group rounded-sm border border-white/20 bg-transparent px-10 py-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 transition-all duration-500 hover:bg-white/5 hover:border-[#CCA876]/50 hover:-translate-y-1"
                        >
                            {t("call")}
                        </a>
                    </div>
                </div>

                {/* RIGHT CONTENT (Photos) */}
                <div className="flex-1 w-full max-w-2xl mx-auto lg:mx-0 relative flex justify-center lg:justify-end gap-4 sm:gap-6 lg:gap-8 min-h-[400px] sm:min-h-[500px]">
                    <div className="w-1/2 relative mt-0 lg:mt-24 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                        <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm group hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] transition-shadow duration-700">
                            <Image
                                src="/photos/chero_door_1.webp"
                                alt="Chero Ambiance"
                                fill
                                className="object-cover scale-100 group-hover:scale-105 transition-transform duration-[10s] ease-out brightness-90 group-hover:brightness-100"
                                sizes="(max-width: 1024px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 border border-white/10 pointer-events-none rounded-sm" />
                        </div>
                    </div>

                    <div className="w-1/2 relative mt-16 sm:mt-20 lg:mt-0 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                        <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm group hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] transition-shadow duration-700">
                            <Image
                                src="/photos/chero_door_2.webp"
                                alt="Chero Details"
                                fill
                                className="object-cover scale-100 group-hover:scale-105 transition-transform duration-[10s] ease-out brightness-90 group-hover:brightness-100"
                                sizes="(max-width: 1024px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 border border-white/10 pointer-events-none rounded-sm" />
                        </div>
                    </div>
                </div>

            </div>

            <style jsx global>{`
                .hero-noise {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
                }
            `}</style>
        </section>
    );
}
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import LocaleSwitch from "@/components/i18n/LocaleSwitch";

export default function HeroBroadcast() {
    const t = useTranslations("home.hero");

    return (
        <section className="relative min-h-[100dvh] w-full bg-[#03070A] overflow-hidden flex flex-col lg:flex-row font-serif selection:bg-[#CCA876]/30 selection:text-white">
            {/* Global Refined Noise & Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,32,44,0.3)_0%,transparent_70%)] pointer-events-none z-0" />
            <div className="absolute inset-0 hero-noise pointer-events-none opacity-[0.25] mix-blend-overlay z-0" />

            {/* Top Bar for Locale Switch */}
            <div className="absolute top-0 right-0 w-full p-6 lg:p-10 z-50 flex justify-end">
                <LocaleSwitch />
            </div>

            {/* LEFT THIRD: Texts and Logo */}
            <div className="relative z-20 flex w-full lg:w-1/3 flex-col justify-center px-8 sm:px-12 lg:pl-16 xl:pl-24 pt-32 pb-12 lg:py-0 lg:h-[100dvh]">
                <div className="animate-fade-in-up drop-shadow-2xl opacity-0" style={{ animationFillMode: 'forwards' }}>
                    <Image
                        src="/brand/logo-white.svg"
                        alt="Chero Logo"
                        width={820}
                        height={340}
                        priority
                        className="w-[180px] sm:w-[240px] lg:w-[320px] h-auto object-contain transform origin-left transition-transform duration-[1.5s] ease-out hover:scale-[1.03]"
                    />
                </div>

                <div className="mt-12 lg:mt-24 flex flex-col space-y-6 lg:space-y-8 border-l-[0.5px] border-white/20 pl-6 lg:pl-10 relative">
                    <div className="absolute -left-[0.5px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#CCA876]/40 to-transparent opacity-0 animate-pulse-slow" style={{ animationDelay: '2s' }} />

                    <p className="max-w-[280px] text-[10px] sm:text-xs lg:text-sm text-white/70 tracking-[0.25em] uppercase leading-[2] animate-fade-in-up opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
                        {t("tagline")}
                    </p>
                    <p className="max-w-[280px] text-[10px] sm:text-xs lg:text-sm text-[#CCA876]/90 tracking-[0.25em] uppercase leading-[2] animate-fade-in-up opacity-0" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
                        {t("tagline2")}
                    </p>
                    <p className="max-w-[280px] text-[10px] sm:text-xs lg:text-sm text-white/50 tracking-[0.25em] uppercase leading-[2] animate-fade-in-up opacity-0" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
                        {t("tagline3")}
                    </p>
                </div>
            </div>

            {/* CENTRAL THIRD: Empty / Scroll Indicator */}
            <div className="relative z-20 flex w-full lg:w-1/3 flex-col items-center justify-end pb-12 lg:pb-20 lg:h-[100dvh]">
                <div className="flex flex-col items-center gap-6 lg:gap-8 animate-fade-in opacity-0 cursor-default" style={{ animationDelay: '1200ms', animationFillMode: 'forwards' }}>
                    <span className="text-[9px] lg:text-[10px] tracking-[0.5em] uppercase text-white/30 font-light font-sans">
                        {t("signal")}
                    </span>
                    <div className="relative h-20 lg:h-32 w-[1px] overflow-hidden flex-shrink-0">
                        <div className="absolute inset-0 bg-white/10" />
                        <div className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-transparent via-[#CCA876] to-[#CCA876] animate-scroll-drop" />
                    </div>
                </div>
            </div>

            {/* RIGHT THIRD: Photo */}
            <div className="relative z-10 w-full lg:w-1/3 h-[45dvh] lg:h-[100dvh] flex flex-col justify-end lg:justify-center overflow-hidden">
                <figure className="relative w-full h-full overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#03070A] via-[#03070A]/40 to-transparent z-10 lg:w-[10%] h-[30%] lg:h-full top-0 lg:left-0" />
                    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#03070A] to-transparent z-10 lg:hidden" />

                    <Image
                        src="/photos/hero_image.webp"
                        alt="Finest Gastronomy"
                        fill
                        priority
                        className="object-cover object-center scale-105 transition-transform duration-[25s] ease-out group-hover:scale-110"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                    />

                    <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(3,7,10,0.8)] z-20 pointer-events-none mix-blend-multiply" />
                </figure>
            </div>

            <style jsx global>{`
                .hero-noise {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
                }
                
                @keyframes scroll-drop {
                    0% { transform: translateY(-100%); opacity: 0; }
                    10% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { transform: translateY(300%); opacity: 0; }
                }

                .animate-scroll-drop {
                    animation: scroll-drop 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
            `}</style>
        </section>
    );
}
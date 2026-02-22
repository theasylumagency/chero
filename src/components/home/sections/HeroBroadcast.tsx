"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import LocaleSwitch from "@/components/i18n/LocaleSwitch";
import { useState, useRef, MouseEvent } from "react";
import { useLocale } from "next-intl";

export default function HeroBroadcast() {
    const t = useTranslations("home.hero");
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const sectionRef = useRef<HTMLElement>(null);
    const locale = useLocale();

    const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <section
            ref={sectionRef}
            onMouseMove={handleMouseMove}
            className="relative overflow-hidden bg-[#071018]"
        >
            {/* Deep Ambient Background */}
            <div className="absolute inset-0 bg-[#050B10] pointer-events-none z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0C1821_0%,transparent_80%)] pointer-events-none z-0" />

            {/* Ethereal Shore/Wave Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-90" aria-hidden>
                {/* Wave 1 */}
                <div className="absolute bottom-[-20%] left-[-10%] w-[120%] h-[80%] bg-[radial-gradient(ellipse_at_bottom,rgba(16,35,46,0.6)_0%,transparent_70%)] animate-wave-swell mix-blend-screen blur-3xl opacity-0" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[120%] h-[70%] bg-[radial-gradient(ellipse_at_bottom,rgba(204,168,118,0.12)_0%,transparent_60%)] animate-wave-foam mix-blend-plus-lighter blur-2xl opacity-0" />

                {/* Wave 2 */}
                <div className="absolute bottom-[-20%] right-[-10%] w-[120%] h-[80%] bg-[radial-gradient(ellipse_at_bottom,rgba(26,50,65,0.5)_0%,transparent_70%)] animate-wave-swell-delayed mix-blend-screen blur-3xl opacity-0" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[120%] h-[70%] bg-[radial-gradient(ellipse_at_bottom,rgba(204,168,118,0.1)_0%,transparent_60%)] animate-wave-foam-delayed mix-blend-plus-lighter blur-2xl opacity-0" />
            </div>

            {/* Interactive Spotlight */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out z-0 mix-blend-screen"
                style={{
                    background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(204, 168, 118, 0.05), transparent 40%)`,
                    opacity: mousePos.x === 0 && mousePos.y === 0 ? 0 : 1
                }}
            />

            {/* Fine dining noise texture */}
            <div className="absolute inset-0 hero-noise pointer-events-none opacity-[0.14] mix-blend-overlay z-0" />

            {/* Cinematic Vignette */}
            <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_50%_40%,transparent_0%,rgba(5,11,16,0.6)_60%,rgba(5,11,16,1)_100%)]" />
            {/* Top bar */}
            <div className="relative mx-auto max-w-6xl px-6 pt-6 z-30">
                <div className="flex items-center justify-end animate-fade-in">
                    <LocaleSwitch />
                </div>
            </div>

            {/* Main Content */}
            <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col items-center justify-center px-6 text-center z-20">
                <div className="animate-fade-in-up mb-8 drop-shadow-2xl hover:scale-[1.02] transition-transform duration-700">
                    <Image
                        src="/brand/logo-white.svg"
                        alt="Chero Logo"
                        width={820}
                        height={340}
                        priority
                        className="mx-auto h-auto w-[280px] sm:w-[500px]"
                    />
                </div>

                <p className="max-w-2xl text-lg sm:text-2xl text-white/90 font-serif tracking-wide leading-relaxed animate-fade-in-up drop-shadow-md" style={{ animationDelay: '200ms' }}>
                    {t("tagline")}<br />{t("tagline2")}<br />{t("tagline3")}
                </p>

                <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                    <a href={`/${locale}/menu`}
                        className="group relative overflow-hidden rounded-full bg-[#CCA876] px-8 py-4 text-sm font-semibold tracking-widest uppercase text-[#050B10] shadow-[0_0_40px_-10px_rgba(204,168,118,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(204,168,118,0.6)]"
                    >
                        <span className="relative z-10">{t("ctaMenu")}</span>
                        <div className="absolute inset-0 translate-y-[100%] bg-white/20 transition-transform duration-300 group-hover:translate-y-0" />
                    </a>
                    <a
                        href="#location"
                        className="group rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-8 py-4 text-sm font-semibold tracking-widest uppercase text-white/90 transition-all duration-300 hover:bg-white/10 hover:border-white/40 hover:scale-105"
                    >
                        {t("ctaFind")}
                    </a>
                </div>

                {/* Ambient scroll indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-fade-in cursor-default" style={{ animationDelay: '800ms' }}>
                    <div className="text-[10px] tracking-[0.3em] uppercase text-white/40">
                        {t("signal")}
                    </div>
                    <div className="h-10 w-[1px] bg-gradient-to-b from-white/40 to-transparent animate-pulse-slow" />
                </div>
            </div>

            <style jsx global>{`
                .hero-noise {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E");
                }
                
                .animate-wave-swell {
                    animation: waveSwell 18s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
                .animate-wave-foam {
                    animation: waveFoam 18s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
                .animate-wave-swell-delayed {
                    animation: waveSwell 18s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                    animation-delay: -9s;
                }
                .animate-wave-foam-delayed {
                    animation: waveFoam 18s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                    animation-delay: -9s;
                }

                @keyframes waveSwell {
                    0%, 100% { transform: translateY(20%) scaleY(0.8); opacity: 0; }
                    30% { transform: translateY(-5%) scaleY(1.1); opacity: 0.8; }
                    60% { transform: translateY(10%) scaleY(0.9); opacity: 0; }
                }

                @keyframes waveFoam {
                    0%, 100% { transform: translateY(25%) scaleY(0.8); opacity: 0; }
                    35% { transform: translateY(-2%) scaleY(1.15); opacity: 0.6; }
                    65% { transform: translateY(15%) scaleY(0.9); opacity: 0; }
                }
            `}</style>
        </section>
    );
}
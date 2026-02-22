"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { getPublicMenu } from "@/lib/menuStore";

export default function MenuSignal() {
    const t = useTranslations("home.menuSignal");
    const locale = useLocale();
    return (
        <section id="menu" className="relative mx-auto max-w-4xl px-6 py-24 sm:py-32">
            {/* Elegant glassmorphic container */}
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-10 sm:p-14 text-center shadow-2xl backdrop-blur-md">

                {/* Subtle spotlight glow behind the content */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-chero-accent/20 rounded-full blur-[80px]" />

                <h2 className="relative z-10 text-3xl sm:text-4xl font-serif text-white tracking-tight">
                    {t("title")}
                </h2>

                <div className="relative z-10 mx-auto mt-6 h-px w-16 bg-chero-accent/40" />

                <div className="relative z-10 mt-10 mx-auto max-w-lg">
                    <div className="group relative flex items-center bg-black/40 rounded-full border border-white/10 p-2 shadow-inner transition-colors duration-300 focus-within:border-chero-accent/40 focus-within:bg-black/60">
                        <input
                            placeholder={t("searchPlaceholder")}
                            className="w-full bg-transparent px-6 py-3 text-sm text-white placeholder:text-white/40 outline-none font-light tracking-wide"
                        />
                        <a href={`/${locale}/menu`}
                            className="shrink-0 rounded-full bg-white px-8 py-3 text-sm font-semibold tracking-widest uppercase text-chero-900 shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.6)]"
                        >
                            {t("openFull")}
                        </a>
                    </div>
                </div>

                <div className="relative z-10 mt-8 text-xs font-light tracking-widest text-white/40 uppercase">
                    (Next step: categories slider + filters)
                </div>
            </div>
        </section>
    );
}
"use client";

import { useLocale } from "next-intl";
import { usePathname, Link, routing } from "@/i18n/routing";

export default function LocaleSwitch({ className = "" }: { className?: string }) {
    const locale = useLocale();
    const pathname = usePathname();

    return (
        <div className={`flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1 backdrop-blur ${className}`}>
            {routing.locales.map((l) => {
                const active = l === locale;
                return (
                    <Link
                        key={l}
                        href={pathname}
                        locale={l}
                        className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition ${active ? "bg-white text-[#071018]" : "text-white/80 hover:bg-white/10"
                            }`}
                        aria-current={active ? "page" : undefined}
                    >
                        {l.toUpperCase()}
                    </Link>
                );
            })}
        </div>
    );
}
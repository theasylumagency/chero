"use client";

import { useRouter } from "next/navigation";
import { routing } from "@/i18n/routing";
import { useLocale } from "next-intl";

export default function AdminLocaleSwitch() {
    const locale = useLocale();
    const router = useRouter();

    const changeLanguage = (newLocale: string) => {
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
        router.refresh();
    };

    return (
        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginLeft: "auto" }}>
            {routing.locales.map((l) => {
                const active = l === locale;
                return (
                    <button
                        key={l}
                        onClick={() => changeLanguage(l)}
                        style={{
                            padding: "4px 8px",
                            borderRadius: "6px",
                            border: active ? "1px solid rgba(183, 199, 255, 0.55)" : "1px solid transparent",
                            background: active ? "rgba(183, 199, 255, 0.12)" : "transparent",
                            color: active ? "#b7c7ff" : "rgba(233, 238, 247, 0.7)",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: active ? "bold" : "normal",
                            textTransform: "uppercase",
                            transition: "all 0.2s"
                        }}
                    >
                        {l}
                    </button>
                );
            })}
        </div>
    );
}

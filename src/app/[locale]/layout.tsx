import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata, Viewport } from "next";

import ka from "../../../messages/ka.json";
import en from "../../../messages/en.json";
import ru from "../../../messages/ru.json";

const MESSAGES = { ka, en, ru } as const;

const siteUrl = "https://chero.online"; // <-- change
const siteName = "რესტორანი ჩერო";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),

    title: {
        default: `${siteName} — Restaurant in Kobuleti`,
        template: `%s — ${siteName}`,
    },
    description:
        "Sea-side Georgian cuisine in Kobuleti. Explore the menu, stories, location, and contacts.",

    applicationName: siteName,

    alternates: {
        canonical: "/",
        languages: {
            ka: "/ka",
            en: "/en",
            ru: "/ru",
        },
    },

    icons: {
        icon: [
            { url: "/favicon-symbol.ico" },
            { url: "/favicon-symbol-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/favicon-symbol-16x16.png", sizes: "16x16", type: "image/png" },
        ],
        apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
        other: [
            { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#ED3237" },
        ],
    },

    manifest: "/site.webmanifest",

    openGraph: {
        type: "website",
        siteName,
        url: "/",
        title: `${siteName} — Restaurant in Kobuleti`,
        description:
            "Sea-side Georgian cuisine in Kobuleti. Explore the menu, stories, location, and contacts.",
        // Add this file when ready:
        // images: [{ url: "/og.jpg", width: 1200, height: 630, alt: siteName }],
    },

    twitter: {
        card: "summary_large_image",
        title: `${siteName} — Restaurant in Kobuleti`,
        description:
            "Sea-side Georgian cuisine in Kobuleti. Explore the menu, stories, location, and contacts.",
        // images: ["/og.jpg"],
    },

    themeColor: "#0b0b0b",
    robots: { index: true, follow: true },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#0b0b0b",
};

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const typedLocale = locale as "ka" | "en" | "ru";

    if (!routing.locales.includes(typedLocale as any)) {
        notFound();
    }

    setRequestLocale(typedLocale);

    return (
        <NextIntlClientProvider key={typedLocale} locale={typedLocale} messages={MESSAGES[typedLocale]}>
            {children}
        </NextIntlClientProvider>
    );
}
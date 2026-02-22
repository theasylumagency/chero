import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

import ka from "../../../messages/ka.json";
import en from "../../../messages/en.json";
import ru from "../../../messages/ru.json";

const MESSAGES = { ka, en, ru } as const;

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: "ka" | "en" | "ru" }>;
}) {
    const { locale } = await params;

    if (!routing.locales.includes(locale)) {
        notFound();
    }

    setRequestLocale(locale);

    return (
        <NextIntlClientProvider key={locale} locale={locale} messages={MESSAGES[locale]}>
            {children}
        </NextIntlClientProvider>
    );
}
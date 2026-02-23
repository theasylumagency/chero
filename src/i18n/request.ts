// src/i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { cookies } from "next/headers";

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!locale) {
        locale = (await cookies()).get("NEXT_LOCALE")?.value;
    }

    if (locale) {
        locale = String(locale).toLowerCase().split("-")[0];
    }

    if (!locale || !routing.locales.includes(locale as any)) {
        locale = routing.defaultLocale;
    }

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default
    };
});
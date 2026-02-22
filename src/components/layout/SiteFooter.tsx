"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import LocaleSwitch from "@/components/i18n/LocaleSwitch";

export default function SiteFooter() {
    const t = useTranslations("footer");
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-white/10 bg-[#050B10]">
            <div className="mx-auto max-w-6xl px-6 py-14">
                <div className="grid gap-10 md:grid-cols-4">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Image src="/brand/logo-white.svg" alt="Chero" width={260} height={120} className="h-auto w-[200px]" />
                        <div className="mt-4 text-sm text-white/70">{t("tagline")}</div>
                    </div>

                    {/* Explore */}
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-white/55">{t("explore")}</div>
                        <ul className="mt-4 space-y-2 text-sm text-white/80">
                            <li><a className="hover:text-white" href="#menu">{t("menu")}</a></li>
                            <li><a className="hover:text-white" href="#picks">{t("picks")}</a></li>
                            <li><a className="hover:text-white" href="#location">{t("find")}</a></li>
                        </ul>
                    </div>

                    {/* Visit */}
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-white/55">{t("visit")}</div>
                        <div className="mt-4 space-y-3 text-sm text-white/80">
                            <div>
                                <div className="text-white/55">{t("addressLabel")}</div>
                                <div>{t("address")}</div>
                            </div>
                            <div>
                                <div className="text-white/55">{t("hoursLabel")}</div>
                                <div>{t("hours")}</div>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-white/55">{t("contact")}</div>
                        <div className="mt-4 space-y-3 text-sm text-white/80">
                            <div className="space-y-2">
                                <a className="hover:text-white underline underline-offset-4" href="tel:+995599616168">
                                    +995 599 616 168
                                </a><br />
                                <a className="hover:text-white underline underline-offset-4" href="tel:+995579058800">
                                    +995 579 058 800
                                </a>
                                <div className="text-xs text-white/55">{t("whatsappNote")}</div>
                            </div>

                            <div className="pt-2">
                                <LocaleSwitch />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-xs text-white/55">{t("copyright", { year })}</div>
                    <div className="text-xs text-white/55">{t("signature")}</div>
                </div>
            </div>
        </footer >
    );
}
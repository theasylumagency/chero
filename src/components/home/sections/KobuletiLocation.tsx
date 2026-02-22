"use client";

import { useLocale, useTranslations } from "next-intl";

const PHONES = {
    primary: { display: "+995 599 616 168", digits: "995599616168" },
    additional: { display: "+995 579 058 800", digits: "995579058800" }
};

export default function KobuletiLocation() {
    const t = useTranslations("home.location");
    const locale = useLocale();

    const address =
        locale === "ka"
            ? "ქობულეთი, დ.აღმაშენებლის გამ. 454"
            : locale === "ru"
                ? "Кобулети, просп. Давида Агмашенебели, 454"
                : "Kobuleti, David Aghmashenebeli Ave. 454";

    const hours = "10:00–24:00";

    const mapsQuery =
        locale === "ka"
            ? "Chero, ქობულეთი დ.აღმაშენებლის გამ. 454"
            : locale === "ru"
                ? "Chero, Кобулети проспект Давида Агмашенебели 454"
                : "Chero, Kobuleti David Aghmashenebeli Ave 454";

    const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;

    return (
        <section id="location" className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32 border-t border-white/5">
            <div className="grid gap-8 lg:grid-cols-12 items-center">

                {/* Map Section */}
                <div className="lg:col-span-7 relative group rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-6 transition-all duration-500 hover:border-white/20">
                    <div className="absolute inset-0 bg-gradient-to-tr from-chero-accent/5 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative h-[400px] w-full rounded-3xl border border-white/10 bg-black/40 overflow-hidden group-hover:shadow-[0_0_50px_-15px_rgba(204,168,118,0.15)] transition-shadow duration-500">
                        <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-sm font-light text-white/50 tracking-wider">
                            Minimal “map card” now (fast). Next step: click-to-load real map embed.
                        </div>
                    </div>
                </div>

                {/* Contact Info Card */}
                <div className="lg:col-span-5 relative z-10 lg:-ml-12 lg:-mt-12 rounded-[2.5rem] border border-white/10 bg-black/80 backdrop-blur-xl p-10 sm:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">
                    <h2 className="text-3xl font-serif text-white tracking-tight">{t("title")}</h2>

                    <div className="mt-4 h-px w-16 bg-chero-accent/40" />

                    <div className="mt-8 space-y-8 text-sm text-white/80">
                        <div>
                            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-chero-accent mb-2">
                                {t("addressLabel")}
                            </div>
                            <div className="text-base font-light text-white/90 leading-relaxed">{address}</div>
                        </div>

                        <div>
                            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-chero-accent mb-2">
                                {t("hoursLabel")}
                            </div>
                            <div className="text-base font-light text-white/90">{hours}</div>
                        </div>

                        <div>
                            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-chero-accent mb-3">
                                {t("phonesLabel")}
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-wrap items-center gap-4">
                                    <a className="text-base font-light text-white/90 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100" href={`tel:+${PHONES.primary.digits}`}>
                                        {PHONES.primary.display}
                                    </a>
                                    <a className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[10px] uppercase tracking-wider hover:bg-white/10 transition-colors"
                                        href={`https://wa.me/${PHONES.primary.digits}`} target="_blank" rel="noopener noreferrer">
                                        WhatsApp
                                    </a>
                                </div>

                                <div className="flex flex-wrap items-center gap-4">
                                    <a className="text-base font-light text-white/90 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100" href={`tel:+${PHONES.additional.digits}`}>
                                        {PHONES.additional.display}
                                    </a>
                                    <a className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[10px] uppercase tracking-wider hover:bg-white/10 transition-colors"
                                        href={`https://wa.me/${PHONES.additional.digits}`} target="_blank" rel="noopener noreferrer">
                                        WhatsApp
                                    </a>
                                </div>

                                <div className="mt-2 text-xs font-light text-white/40 italic">{t("whatsAppNote")}</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4">
                        <a
                            href={mapsHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-center rounded-full bg-white px-8 py-4 text-xs font-semibold uppercase tracking-widest text-[#071018] shadow-lg transition-transform hover:-translate-y-1"
                        >
                            {t("openMap")}
                        </a>

                        <a
                            href={`tel:+${PHONES.primary.digits}`}
                            className="text-center rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white/90 transition-all hover:bg-white/10 hover:-translate-y-1 hover:border-white/40"
                        >
                            {t("call")}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
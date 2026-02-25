"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Highlights() {
    const t = useTranslations("home.highlights");

    const picks = [
        {
            name: t("items.adjaruli.name"),
            story: t("items.adjaruli.story"),
            image: "/highlights/adjaruli.webp"
        },
        {
            name: t("items.khinkali.name"),
            story: t("items.khinkali.story"),
            image: "/highlights/khinkali.webp"
        },
        {
            name: t("items.mtsvadi.name"),
            story: t("items.mtsvadi.story"),
            image: "/highlights/mcvadi.webp"
        }
    ];

    return (
        <section className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
            {/* Ambient background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-chero-accent/10 blur-[120px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center sm:items-start sm:text-left sm:flex-row justify-between gap-6 mb-16">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-serif text-white tracking-tight">
                        {t("title")}
                    </h2>
                    <div className="mt-4 h-px w-20 bg-gradient-to-r from-chero-accent to-transparent sm:mx-0 mx-auto" />
                </div>
            </div>

            <div className="relative z-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 perspective-[1000px]">
                {picks.map((d, i) => (
                    <div
                        key={d.name}
                        className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 shadow-2xl transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_20px_40px_-15px_rgba(204,168,118,0.3)] hover:border-chero-accent/30"
                        style={{ animationDelay: `${i * 150}ms` }}
                    >
                        <div className="relative aspect-[3/4] w-full overflow-hidden">
                            <Image
                                src={d.image}
                                alt={d.name}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                                priority={false}
                            />

                            {/* Rich double gradient overlay for luxurious text legibility */}
                            <div className="absolute inset-0 bg-gradient-to-t from-chero-900/95 via-chero-900/40 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />

                            <div className="absolute inset-x-0 bottom-0 p-8 transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                                <h3 className="text-xl sm:text-2xl font-serif text-white tracking-wide">
                                    {d.name}
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-white/70 opacity-0 transition-opacity duration-500 delay-100 group-hover:opacity-100">
                                    {d.story}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
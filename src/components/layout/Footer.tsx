import CheroLogo from "@/components/brand/CheroLogo";
import { useLocale, useTranslations } from "next-intl";

const PHONES = {
    primary: { display: "+995 599 616 168", digits: "995599616168" },
    additional: { display: "+995 579 058 800", digits: "995579058800" }
};

export default function Footer() {
    const t = useTranslations("footer");
    const locale = useLocale();

    const address =
        locale === "ka"
            ? "ქობულეთი, დ.აღმაშენებლის გამ. 454"
            : locale === "ru"
                ? "Кобулети, просп. Давида Агмашенебели, 454"
                : "Kobuleti, David Aghmashenebeli Ave. 454";

    const year = new Date().getFullYear();

    return (
        <footer className="mt-10 border-t border-white/10 bg-black/30">
            <div className="mx-auto max-w-6xl px-6 py-12">
                <div className="grid gap-10 lg:grid-cols-4">
                    <div className="lg:col-span-2">
                        <CheroLogo className="w-[260px] text-white" />
                        <p className="mt-4 max-w-md text-sm text-white/65">
                            {t("tagline")}
                        </p>
                    </div>

                    <div>
                        <div className="text-xs uppercase tracking-widest text-white/50">{t("visit")}</div>
                        <div className="mt-3 space-y-2 text-sm text-white/80">
                            <div>{address}</div>
                            <div>10:00–24:00</div>
                        </div>

                        <div className="mt-5 text-xs text-white/50">{t("whatsapp")}</div>
                        <div className="mt-2 space-y-2 text-sm">
                            <a className="block text-white/80 hover:text-white" href={`https://wa.me/${PHONES.primary.digits}`} target="_blank" rel="noreferrer">
                                WhatsApp: {PHONES.primary.display}
                            </a>
                            <a className="block text-white/80 hover:text-white" href={`https://wa.me/${PHONES.additional.digits}`} target="_blank" rel="noreferrer">
                                WhatsApp: {PHONES.additional.display}
                            </a>
                        </div>
                    </div>

                    <div>
                        <div className="text-xs uppercase tracking-widest text-white/50">{t("links")}</div>
                        <div className="mt-3 flex flex-col gap-2 text-sm">
                            <a className="text-white/80 hover:text-white" href="#menu">{t("menu")}</a>
                            <a className="text-white/80 hover:text-white" href="#location">{t("find")}</a>
                            <a className="text-white/80 hover:text-white" href={`tel:+${PHONES.primary.digits}`}>{t("call")}</a>
                        </div>

                        <div className="mt-6 text-xs uppercase tracking-widest text-white/50">{t("lang")}</div>
                        <div className="mt-3 flex gap-2 text-sm">
                            <a className="rounded-full border border-white/15 px-3 py-1 text-white/75 hover:text-white" href="/ka">KA</a>
                            <a className="rounded-full border border-white/15 px-3 py-1 text-white/75 hover:text-white" href="/en">EN</a>
                            <a className="rounded-full border border-white/15 px-3 py-1 text-white/75 hover:text-white" href="/ru">RU</a>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
                    <div>© {year} Chero • Taste of Georgia • 1998</div>
                    <div>{t("note")}</div>
                </div>
            </div>
        </footer>
    );
}
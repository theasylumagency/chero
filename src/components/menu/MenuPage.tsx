import SiteFooter from "@/components/layout/SiteFooter";
import MenuHero from "./MenuHero";
import MenuClient from "./MenuClient";

export type PublicDish = {
    id: string;
    title: string;
    description: string;
    story: string;
    priceMinor: number;
    priceLabel: string;
    priceVariants: { priceMinor: number; label: string }[];
    currency: "GEL";
    vegetarian: boolean;
    topRated: boolean;
    chefsPick: boolean;
    soldOut: boolean;
    photo: { full: string; small: string } | null;
};

export type PublicCategory = {
    id: string;
    title: string;
    dishes: PublicDish[];
};

export default function MenuPage({
    locale,
    menu,
}: {
    locale: "ka" | "en" | "ru";
    menu: PublicCategory[];
}) {
    return (
        <main className="min-h-screen bg-[#071018] text-white">
            <MenuHero locale={locale} />
            <MenuClient menu={menu} />
            <SiteFooter />
        </main>
    );
}
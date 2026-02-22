import MenuPage from "@/components/menu/MenuPage";
import { getPublicMenu } from "@/lib/menuStore";

export default async function Page({
    params,
}: {
    params: Promise<{ locale: "ka" | "en" | "ru" }>;
}) {
    const { locale } = await params;
    const menu = await getPublicMenu(locale);

    return <MenuPage locale={locale} menu={menu} />;
}
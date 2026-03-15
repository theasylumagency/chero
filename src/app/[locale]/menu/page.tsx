import MenuPage from "@/components/menu/MenuPage";
import { getPublicMenu } from "@/lib/menuStore";

// Revalidate the menu page every 60 seconds (ISR)
// This provides a balance between fresh data and fast page loads
export const revalidate = 60;

export default async function Page({
    params,
}: {
    params: Promise<{ locale: "ka" | "en" | "ru" }>;
}) {
    const { locale } = await params;
    const menu = await getPublicMenu(locale);

    return <MenuPage locale={locale} menu={menu} />;
}
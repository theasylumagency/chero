import "./admin.css";
import UnsavedChangesProvider from "./ui/unsaved/UnsavedChangesProvider";
import AdminNavLink from "./ui/unsaved/AdminNavLink";
import AdminLocaleSwitch from "./ui/AdminLocaleSwitch";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminCookieName, verifyAdminSession } from "@/lib/adminAuth";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export const runtime = "nodejs";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
    const token = (await cookies()).get(getAdminCookieName())?.value;
    const ok = verifyAdminSession(token);
    if (!ok) redirect("/admin/login");

    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages}>
            <UnsavedChangesProvider>
                <div>
                    <header style={{ padding: 14 }}>
                        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", gap: 16 }}>
                                <AdminNavLink href="/admin">Dashboard</AdminNavLink>
                                <AdminNavLink href="/admin/categories">Categories</AdminNavLink>
                                <AdminNavLink href="/admin/dishes">Dishes</AdminNavLink>
                            </div>
                            <AdminLocaleSwitch />
                        </div>
                    </header>

                    <main>
                        <div style={{ maxWidth: 1100, margin: "0 auto", padding: 18 }}>{children}</div>
                    </main>
                </div>
            </UnsavedChangesProvider>
        </NextIntlClientProvider>
    );
}

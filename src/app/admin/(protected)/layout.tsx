import "./admin.css";
import UnsavedChangesProvider from "./ui/unsaved/UnsavedChangesProvider";
import AdminSidebar from "./ui/AdminSidebar";
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
                <div className="flex min-h-screen bg-[#0b0d12]">
                    <AdminSidebar />

                    <main className="flex-1 flex flex-col min-w-0">
                        <div className="flex-1 p-6 md:p-10">
                            <div className="max-w-[1200px] mx-auto">
                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </UnsavedChangesProvider>
        </NextIntlClientProvider>
    );
}

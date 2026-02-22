import { listBackups } from "@/lib/history";
import HistoryClient from "./ui/HistoryClient";

export const runtime = "nodejs";

export default async function AdminHome() {
    const [categories, dishes] = await Promise.all([listBackups("categories"), listBackups("dishes")]);

    return (
        <div style={{ display: "grid", gap: 16 }}>
            <div>
                <h1>Dashboard</h1>
                <p style={{ opacity: 0.8 }}>
                    Below is the change history for your JSON files. You can restore any previous version.
                </p>
            </div>

            <HistoryClient initialCategories={categories} initialDishes={dishes} />
        </div>
    );
}

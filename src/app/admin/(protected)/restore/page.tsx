import { listBackups } from "@/lib/history";
import HistoryClient from "../ui/HistoryClient";

export const runtime = "nodejs";

export default async function AdminRestorePage() {
    const [categories, dishes] = await Promise.all([listBackups("categories"), listBackups("dishes")]);

    return (
        <div style={{ display: "grid", gap: 16 }}>
            <div>
                <h1 className="text-3xl font-serif text-white mb-2 tracking-wide">System Restore</h1>
                <p className="text-[#9aa6bd] font-light tracking-wide">
                    Below is the change history for your JSON files. You can restore any previous version.
                </p>
            </div>

            <HistoryClient initialCategories={categories} initialDishes={dishes} />
        </div>
    );
}

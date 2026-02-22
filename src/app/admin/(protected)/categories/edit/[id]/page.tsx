import { loadCategories } from "@/lib/menuStore";
import { notFound } from "next/navigation";
import CategoryForm from "../../ui/CategoryForm";

export const runtime = "nodejs";

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
    const wrap = await loadCategories();
    const cat = wrap.items.find((c) => c.id === params.id);
    if (!cat) return notFound();
    return <CategoryForm mode="edit" initial={cat} />;
}

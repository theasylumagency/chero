import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";
import sharp from "sharp";
import { loadDishes, saveDishes } from "@/lib/menuStore";

export const runtime = "nodejs";

type CropPixels = { x: number; y: number; width: number; height: number };

export async function POST(req: NextRequest) {
    // Minimal protection suggestion:
    // Put /admin + /api/admin behind Nginx Basic Auth on your VPS.
    // (We’ll add app-level auth next if you want.)

    const form = await req.formData();

    const dishId = String(form.get("dishId") ?? "");
    const file = form.get("file") as File | null;
    const cropRaw = String(form.get("crop") ?? "");

    if (!dishId || !file || !cropRaw) {
        return NextResponse.json({ error: "dishId, file, crop are required" }, { status: 400 });
    }

    let crop: CropPixels;
    try {
        crop = JSON.parse(cropRaw) as CropPixels;
    } catch {
        return NextResponse.json({ error: "Invalid crop JSON" }, { status: 400 });
    }

    // Basic file size guard (protects server)
    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
        return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 413 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const input = Buffer.from(arrayBuffer);

    // Decode once, crop, then produce two outputs
    const image = sharp(input, { failOn: "none" }).rotate();

    // Optional pixel-dimension guard
    const meta = await image.metadata();
    const w = meta.width ?? 0;
    const h = meta.height ?? 0;
    if (w * h > 40_000_000) {
        return NextResponse.json({ error: "Image dimensions too large" }, { status: 413 });
    }

    const cropped = image.extract({
        left: Math.max(0, Math.floor(crop.x)),
        top: Math.max(0, Math.floor(crop.y)),
        width: Math.max(1, Math.floor(crop.width)),
        height: Math.max(1, Math.floor(crop.height)),
    });

    const uploadDir = path.join(process.cwd(), "public", "uploads", "dishes");
    await fs.mkdir(uploadDir, { recursive: true });

    const fullName = `dish_${dishId}_1600.webp`;
    const smallName = `dish_${dishId}_800.webp`;

    const fullPath = path.join(uploadDir, fullName);
    const smallPath = path.join(uploadDir, smallName);

    await Promise.all([
        cropped
            .clone()
            .resize(1600, 900, { fit: "cover" })
            .webp({ quality: 82 })
            .toFile(fullPath),
        cropped
            .clone()
            .resize(800, 450, { fit: "cover" })
            .webp({ quality: 82 })
            .toFile(smallPath),
    ]);

    // Write filenames into dishes.json
    const wrap = await loadDishes();
    const idx = wrap.items.findIndex((d) => d.id === dishId);
    if (idx === -1) {
        return NextResponse.json({ error: "Dish not found" }, { status: 404 });
    }

    wrap.items[idx] = {
        ...wrap.items[idx],
        photo: { full: fullName, small: smallName },
    };

    await saveDishes(wrap);

    return NextResponse.json({
        ok: true,
        photo: {
            full: `/uploads/dishes/${fullName}`,
            small: `/uploads/dishes/${smallName}`,
        },
    });
}

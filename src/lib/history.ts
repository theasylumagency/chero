import fs from "node:fs/promises";
import path from "node:path";
import { withFileLock } from "./fsSafe";

export type HistoryKind = "categories" | "dishes";
export type BackupItem = { file: string; label: string };

const DATA_DIR = path.join(process.cwd(), "data");
const LOCK_PATH = path.join(DATA_DIR, ".menu.lock");

function targetFile(kind: HistoryKind) {
    return kind === "categories" ? "categories.json" : "dishes.json";
}

function isSafeFilename(name: string) {
    return !name.includes("/") && !name.includes("\\") && !name.includes("..");
}

export async function listBackups(kind: HistoryKind): Promise<BackupItem[]> {
    const base = targetFile(kind);
    const prefix = `${base}.bak.`;

    const files = await fs.readdir(DATA_DIR).catch(() => []);
    const backups = files
        .filter((f) => f.startsWith(prefix))
        .map((f) => {
            const ts = f.slice(prefix.length); // whatever format your backups use
            return { file: f, label: ts };
        })
        .sort((a, b) => (a.label < b.label ? 1 : -1)); // newest first

    return backups;
}

export async function restoreBackup(kind: HistoryKind, backupFile: string) {
    const base = targetFile(kind);

    if (!isSafeFilename(backupFile)) {
        throw new Error("Invalid backup filename");
    }
    if (!backupFile.startsWith(`${base}.bak.`)) {
        throw new Error("Backup file does not match kind");
    }

    const backupPath = path.join(DATA_DIR, backupFile);
    const targetPath = path.join(DATA_DIR, base);

    // ensure backup exists
    await fs.stat(backupPath);

    await withFileLock(LOCK_PATH, async () => {
        // safety backup current
        const safety = `${base}.bak.restore.${new Date().toISOString().replace(/[:.]/g, "-")}`;
        const safetyPath = path.join(DATA_DIR, safety);

        await fs.copyFile(targetPath, safetyPath).catch(() => { });
        await fs.copyFile(backupPath, targetPath);
    });

    return { ok: true };
}

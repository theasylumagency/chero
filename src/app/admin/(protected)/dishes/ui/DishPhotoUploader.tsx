"use client";

import { useCallback, useMemo, useState } from "react";
import Cropper from "react-easy-crop";

type Photo = { full: string; small: string } | null;

export default function DishPhotoUploader({ dishId, current }: { dishId: string; current: { full: string; small: string } | null }) {
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedPixels, setCroppedPixels] = useState<any>(null);

    const [busy, setBusy] = useState(false);
    const [result, setResult] = useState<Photo>(current ? { full: `/uploads/dishes/${current.full}`, small: `/uploads/dishes/${current.small}` } : null);

    const open = useMemo(() => !!imageUrl, [imageUrl]);

    const onCropComplete = useCallback((_area: any, areaPixels: any) => {
        setCroppedPixels(areaPixels);
    }, []);

    function onPick(f: File | null) {
        setFile(f);
        if (!f) return;
        const url = URL.createObjectURL(f);
        setImageUrl(url);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        setCroppedPixels(null);
    }

    async function upload() {
        if (!file || !croppedPixels) return;
        setBusy(true);

        const form = new FormData();
        form.append("dishId", dishId);
        form.append("file", file);
        form.append("crop", JSON.stringify(croppedPixels));

        const r = await fetch("/api/admin/dishes/photo", { method: "POST", body: form });
        setBusy(false);

        if (!r.ok) {
            alert("Upload failed");
            return;
        }

        const j = await r.json();
        setResult(j.photo);
        // close modal
        if (imageUrl) URL.revokeObjectURL(imageUrl);
        setImageUrl(null);
        setFile(null);
    }

    return (
        <div>
            {result && (
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
                    <img src={result.small} alt="" style={{ width: 240, height: 135, objectFit: "cover", borderRadius: 8, border: "1px solid #ddd" }} />
                    <div style={{ color: "#666" }}>Current: {result.small}</div>
                </div>
            )}

            <input
                type="file"
                accept="image/*"
                onChange={(e) => onPick(e.target.files?.[0] ?? null)}
            />

            {open && (
                <div style={{ marginTop: 12, border: "1px solid #ddd", borderRadius: 12, overflow: "hidden" }}>
                    <div style={{ position: "relative", width: "100%", height: 360, background: "#111" }}>
                        <Cropper
                            image={imageUrl!}
                            crop={crop}
                            zoom={zoom}
                            aspect={16 / 9}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    </div>

                    <div style={{ display: "flex", gap: 12, padding: 12, alignItems: "center" }}>
                        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            Zoom
                            <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} />
                        </label>

                        <button onClick={upload} disabled={busy || !croppedPixels} style={{ padding: "8px 12px" }}>
                            {busy ? "Uploading..." : "Crop + Save"}
                        </button>

                        <button
                            onClick={() => {
                                if (imageUrl) URL.revokeObjectURL(imageUrl);
                                setImageUrl(null);
                                setFile(null);
                            }}
                            style={{ padding: "8px 12px" }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

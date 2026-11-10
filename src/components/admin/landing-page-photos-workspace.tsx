"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

type Slot = "hero" | "corporate" | "technology" | "engineering" | "renewable-energy" | "global-business";
type Asset = { slot: Slot; object_path: string; original_filename: string; mime_type: string; byte_size: number; updated_at: string };
type Props = { assets: Asset[] };
const slots: { key: Slot; title: string; description: string }[] = [
  { key: "hero", title: "Homepage hero", description: "The main globe and skyline image at the top of the homepage." },
  { key: "corporate", title: "Corporate image", description: "The wide corporate image below the introduction." },
  { key: "technology", title: "NSOMEX Technology", description: "The image on the Technology division card." },
  { key: "engineering", title: "NSOMEX Engineering", description: "The image on the Engineering division card." },
  { key: "renewable-energy", title: "NSOMEX Renewable Energy", description: "The image on the Renewable Energy division card." },
  { key: "global-business", title: "NSOMEX Global Business", description: "The image on the Global Business division card." },
];
const maxBytes = 10 * 1024 * 1024;
const mimeTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export function LandingPagePhotosWorkspace({ assets }: Props) {
  const router = useRouter();
  const search = useSearchParams();
  const fr = search.get("lang") === "fr";
  const [busySlot, setBusySlot] = useState<Slot | null>(null);
  const [message, setMessage] = useState("");
  const t = fr ? {
    eyebrow: "IMAGES DU SITE", title: "Photos de la page d’accueil",
    intro: "Téléversez ou remplacez les images globales affichées sur la page d’accueil. Aucune division n’est requise.",
    upload: "Téléverser / remplacer", uploading: "Téléversement…", current: "Image actuelle",
    none: "Aucune image personnalisée. L’image illustrative actuelle reste affichée.",
    success: "Image enregistrée. La page publique a été actualisée.",
    invalid: "Choisissez une image JPEG, PNG, WebP ou AVIF de 10 Mo maximum.",
    unavailable: "Supabase n’est pas configuré.", failed: "Échec du téléversement ou de l’enregistrement.",
  } : {
    eyebrow: "WEBSITE IMAGES", title: "Landing Page Photos",
    intro: "Upload or replace the global images displayed on the public homepage. These images are not assigned to divisions.",
    upload: "Upload / replace", uploading: "Uploading…", current: "Current image",
    none: "No custom image uploaded. The existing illustrative image remains in use.",
    success: "Image saved. The public homepage will now use this image.",
    invalid: "Choose a JPEG, PNG, WebP or AVIF image no larger than 10 MB.",
    unavailable: "Supabase is not configured.", failed: "Upload or save failed.",
  };
  const bySlot = new Map(assets.map(asset => [asset.slot, asset]));
  const supabase = createClient();

  async function upload(slot: Slot, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!mimeTypes.includes(file.type) || file.size < 1 || file.size > maxBytes) {
      setMessage(t.invalid);
      event.target.value = "";
      return;
    }
    const supabase = createClient();
    if (!supabase) { setMessage(t.unavailable); return; }
    setBusySlot(slot);
    setMessage("");
    const oldAsset = bySlot.get(slot);
    const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "img";
    const path = `landing/${slot}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("nsomex-website").upload(path, file, {
      contentType: file.type,
      upsert: false,
      cacheControl: "31536000",
    });
    if (uploadError) {
      setMessage(uploadError.message);
      setBusySlot(null);
      event.target.value = "";
      return;
    }
    const { error: saveError } = await supabase.from("landing_page_media").upsert({
      slot,
      object_path: path,
      original_filename: file.name.slice(0, 255),
      mime_type: file.type,
      byte_size: file.size,
      updated_at: new Date().toISOString(),
    }, { onConflict: "slot" });
    if (saveError) {
      await supabase.storage.from("nsomex-website").remove([path]);
      setMessage(saveError.message || t.failed);
    } else {
      if (oldAsset?.object_path) await supabase.storage.from("nsomex-website").remove([oldAsset.object_path]);
      setMessage(t.success);
      router.refresh();
    }
    setBusySlot(null);
    event.target.value = "";
  }

  return <div className="cms-landing-photos">
    <div className="cms-landing-intro">
      <p className="cms-eyebrow">{t.eyebrow}</p>
      <h2>{t.title}</h2>
      <p>{t.intro}</p>
    </div>
    <div className="cms-landing-photo-grid">
      {slots.map(slot => {
        const asset = bySlot.get(slot.key);
        const preview = asset
          ? supabase?.storage.from("nsomex-website").getPublicUrl(asset.object_path).data.publicUrl
          : null;
        const busy = busySlot === slot.key;
        return <article className="cms-landing-photo-card" key={slot.key}>
          <div className="cms-landing-photo-preview">
            {preview ? <img src={preview} alt={slot.title} /> : <div className="cms-landing-photo-empty">NSOMEX</div>}
          </div>
          <div className="cms-landing-photo-body">
            <h3>{slot.title}</h3>
            <p>{slot.description}</p>
            {asset ? <small>{t.current}: {asset.original_filename}</small> : <small>{t.none}</small>}
            <label className="cms-landing-upload">
              {busy ? t.uploading : t.upload}
              <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={Boolean(busySlot)} onChange={event => upload(slot.key, event)} />
            </label>
          </div>
        </article>;
      })}
    </div>
    {message && <p className="cms-project-message" role="status">{message}</p>}
  </div>;
}

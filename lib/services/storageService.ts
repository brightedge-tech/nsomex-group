import { getSupabaseServerClient } from "@/lib/supabase/server";

const ALLOWED_IMAGES = new Map([
  ["image/jpeg", { extension: "jpg", maxSize: 10 * 1024 * 1024 }],
  ["image/png", { extension: "png", maxSize: 10 * 1024 * 1024 }],
  ["image/webp", { extension: "webp", maxSize: 10 * 1024 * 1024 }],
]);

async function validateImage(file: File) {
  const allowed = ALLOWED_IMAGES.get(file.type);
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!allowed || extension !== allowed.extension || file.size <= 0 || file.size > allowed.maxSize) {
    return { error: { code: "VALIDATION", message: "Upload a JPEG, PNG, or WebP image within the allowed size limit." } };
  }

  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const validSignature = file.type === "image/jpeg"
    ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
    : file.type === "image/png"
      ? bytes.length >= 8 && [137, 80, 78, 71, 13, 10, 26, 10].every((value, index) => bytes[index] === value)
      : bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  if (!validSignature) return { error: { code: "VALIDATION", message: "The uploaded file content does not match an allowed image type." } };
  return { extension: allowed.extension };
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export const storageService = {
  async uploadProductImage(file: File, productId: string) {
    if (!isUuid(productId)) return { data: null, error: { code: "VALIDATION", message: "A valid product ID is required." } };
    const validation = await validateImage(file);
    if (validation.error) return { data: null, error: validation.error };
    const client = await getSupabaseServerClient();
    if (!client) {
      return { data: null, error: { code: "SERVER", message: "Supabase storage is not configured for uploads." } };
    }

    const bucketPath = `${productId}/${crypto.randomUUID()}.${validation.extension}`;
    const { data, error } = await client.storage.from("product-images").upload(bucketPath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

    return { data, error };
  },

  async uploadSupplierLogo(file: File, supplierId: string) {
    if (!isUuid(supplierId)) return { data: null, error: { code: "VALIDATION", message: "A valid supplier ID is required." } };
    const validation = await validateImage(file);
    if (validation.error) return { data: null, error: validation.error };
    const client = await getSupabaseServerClient();
    if (!client) {
      return { data: null, error: { code: "SERVER", message: "Supabase storage is not configured for uploads." } };
    }

    const bucketPath = `${supplierId}/${crypto.randomUUID()}.${validation.extension}`;
    const { data, error } = await client.storage.from("supplier-logos").upload(bucketPath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

    return { data, error };
  },

  async uploadUserAvatar(file: File) {
    const validation = await validateImage(file);
    if (validation.error) return { data: null, error: validation.error };
    const client = await getSupabaseServerClient();
    if (!client) return { data: null, error: { code: "SERVER", message: "Supabase storage is not configured for uploads." } };
    const { data: { user }, error: authError } = await client.auth.getUser();
    if (authError || !user) return { data: null, error: { code: "UNAUTHORIZED", message: "Sign in before uploading an avatar." } };
    const path = `${user.id}/${crypto.randomUUID()}.${validation.extension}`;
    const { data, error } = await client.storage.from("user-avatars").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });
    return { data, error };
  },
};

import { API_URL } from "@/lib/api";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read that file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image through the API so the imgbb key never reaches the browser.
 * Falls back to a helpful error when the server has no key configured.
 */
export async function uploadImage(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Choose a PNG, JPG or WebP image");
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be smaller than 5MB");
  }

  const dataUrl = await readFileAsDataUrl(file);
  const response = await fetch(`${API_URL}/api/uploads/image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: dataUrl }),
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.message ?? "Upload failed");
  }

  return body.data.url as string;
}

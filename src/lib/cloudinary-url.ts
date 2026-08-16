const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

/** Build a Cloudinary delivery URL without the Node SDK (safe for client bundles). */
export function optimizedUrl(publicId: string, options?: Record<string, string | number>) {
  const base = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`;
  const transforms = [
    "f_auto",
    "q_auto:good",
    ...Object.entries(options ?? {}).map(([k, v]) => `${k}_${v}`),
  ].join(",");
  return `${base}${transforms}/${publicId}`;
}
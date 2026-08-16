import { v2 as cloudinary } from "cloudinary";
import { env } from "@/lib/env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { optimizedUrl } from "@/lib/cloudinary-url";

export interface CldImageMeta {
  public_id: string;
  secure_url: string;
  width?: number;
  height?: number;
}

/** Signed URL valid for `minutes` (for protected digital downloads). */
export function signedUrl(publicId: string, minutes = 5, options?: Record<string, string | number>) {
  return cloudinary.url(publicId, {
    secure: true,
    sign_url: true,
    expiration: Math.floor(Date.now() / 1000) + minutes * 60,
    transformation: options,
  });
}

/** Server-side signed upload params for direct-to-Cloudinary uploads. */
export function signedUploadParams(folder = "khurana-studio") {
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { timestamp, folder };
  const signature = cloudinary.utils.api_sign_request(params, env.CLOUDINARY_API_SECRET!);
  return {
    apiKey: env.CLOUDINARY_API_KEY,
    timestamp,
    signature,
    folder,
    cloudName: env.CLOUDINARY_CLOUD_NAME,
  };
}

export function deleteAsset(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}

export { cloudinary };
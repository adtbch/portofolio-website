import "server-only";
import { v2 as cloudinary } from "cloudinary";
import { cloudinary as cloudinaryServer } from "@/lib/cloudinary/server";

/** Signed upload params for the browser. Expires in 1 hour. */
export function signUpload(folder = "portfolio/misc") {
  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinaryServer.utils.api_sign_request(
    { folder, timestamp },
    process.env.CLOUDINARY_API_SECRET!,
  );
  return {
    timestamp,
    folder,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  };
}

export function optimizeUrl(url: string) {
  return url.replace("/upload/", "/upload/f_auto,q_auto/");
}

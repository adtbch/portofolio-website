const FALLBACK = "/images/fallback-project-cover.svg";

/** Resolve a project image reference into a usable URL. Pure: safe in client and server. */
export function buildCoverUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) return FALLBACK;
  if (imageUrl.startsWith("/")) return imageUrl;
  if (imageUrl.startsWith("http")) return imageUrl;
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloud) return FALLBACK;
  return `https://res.cloudinary.com/${cloud}/image/upload/${imageUrl}`;
}
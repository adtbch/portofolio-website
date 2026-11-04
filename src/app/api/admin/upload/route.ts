import "server-only";
import { cloudinary } from "@/lib/cloudinary/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAdminAuthed } from "@/lib/admin/auth";
import crypto from "node:crypto";

function getFolder(subfolder: string) {
  const base = process.env.CLOUDINARY_FOLDER || "MyPortfolioWebsite";
  return `${base}/${subfolder}`;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (!(await isAdminAuthed(cookieStore.get("admin_session")?.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Idempotent upload via content hash (SHA-256)
    const hash = crypto.createHash("sha256").update(buffer).digest("hex").slice(0, 16);
    const subfolder = folder || "misc";
    const uploadFolder = getFolder(subfolder);

    // Reuse existing asset before calling upload: true idempotency.
    const existing = await cloudinary.api
      .resources({ type: "upload", prefix: `${uploadFolder}/${hash}`, max_results: 1 })
      .then(res => (res.resources && res.resources[0]) || null)
      .catch(() => null);

    if (existing) {
      return NextResponse.json({
        url: existing.secure_url,
        public_id: existing.public_id,
        reused: true,
      });
    }

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: uploadFolder,
            public_id: hash,
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    const message = error?.message?.toString() || "";
    if (message.includes("Invalid API key") || message.includes("Must supply api_key")) {
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

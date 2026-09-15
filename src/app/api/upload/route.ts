import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getAdminUser } from "@/libs/supabase/auth";
import { uploadToR2 } from "@/libs/r2";

export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Use PNG, JPEG, WEBP, GIF, or SVG." },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File is too large. Max size is 5MB." },
      { status: 400 },
    );
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
    const key = `writings/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`;

    const url = await uploadToR2({
      key,
      body: bytes,
      contentType: file.type,
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { error: "Upload failed. Try again." },
      { status: 500 },
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { createSignedUploadUrl } from "@/lib/r2/client";
import { nanoid } from "nanoid";

const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ALLOWED_VOICE_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/m4a",
  "audio/x-m4a",
  "audio/webm",
  "audio/wave",
  "audio/ogg",
];

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB raw limit
const MAX_VOICE_SIZE = 6 * 1024 * 1024; // 6 MB limit

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileName, contentType, fileSize, kind } = body;

    // 1. Basic validation
    if (!fileName || !contentType || !fileSize || !kind) {
      return NextResponse.json(
        { error: "Missing required parameters (fileName, contentType, fileSize, kind)" },
        { status: 400 }
      );
    }

    if (kind !== "photo" && kind !== "voice") {
      return NextResponse.json(
        { error: "Invalid upload kind. Must be 'photo' or 'voice'" },
        { status: 400 }
      );
    }

    // 2. Strict security validation
    if (kind === "photo") {
      if (!ALLOWED_PHOTO_TYPES.includes(contentType.toLowerCase())) {
        return NextResponse.json(
          { error: "Unsupported image format. Allowed: JPG, PNG, WEBP" },
          { status: 400 }
        );
      }
      if (fileSize > MAX_PHOTO_SIZE) {
        return NextResponse.json(
          { error: "Photo size exceeds 5MB limit" },
          { status: 400 }
        );
      }
    } else {
      if (!ALLOWED_VOICE_TYPES.includes(contentType.toLowerCase())) {
        return NextResponse.json(
          { error: "Unsupported audio format. Allowed: MP3, WAV, M4A, WEBM" },
          { status: 400 }
        );
      }
      if (fileSize > MAX_VOICE_SIZE) {
        return NextResponse.json(
          { error: "Voice note size exceeds 5MB limit" },
          { status: 400 }
        );
      }
    }

    // Sanitize file name to avoid path traversal or S3 naming issues
    const sanitizedName = fileName
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .substring(0, 100);

    // Create a temporary upload key prefix (order_tmp_...)
    const tempId = `tmp_${nanoid(10)}`;
    const fileId = nanoid(6);
    
    // Key structure: pending/order_{tempId}/assets/{fileId}_{sanitizedName}
    const key = `pending/order_${tempId}/assets/${fileId}_${sanitizedName}`;

    // 3. Generate pre-signed URL from R2 helper client
    const uploadUrl = await createSignedUploadUrl(key, contentType, 3600); // 1 hour expiry
    const publicBaseUrl = process.env.PUBLIC_CARD_BASE_URL || "";
    
    // Clean public base URL from trailing slashes
    const baseUrlClean = publicBaseUrl.endsWith("/") ? publicBaseUrl.slice(0, -1) : publicBaseUrl;
    const publicUrl = `${baseUrlClean}/${key}`;

    return NextResponse.json({
      uploadUrl,
      key,
      publicUrl,
    });
  } catch (error: any) {
    console.error("Error generating upload URL:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

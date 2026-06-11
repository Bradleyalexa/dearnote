import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.R2_ACCOUNT_ID;
const bucketName = process.env.R2_BUCKET || "dearnote";
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const endpoint = process.env.R2_ENDPOINT;

// Validate that R2 configurations are provided
if (!accountId || !accessKeyId || !secretAccessKey || !endpoint) {
  console.warn("WARNING: Cloudflare R2 environment variables are missing!");
}

export const s3Client = new S3Client({
  region: "auto",
  endpoint: endpoint,
  credentials: {
    accessKeyId: accessKeyId || "",
    secretAccessKey: secretAccessKey || "",
  },
});

/**
 * Upload a raw file to the R2 bucket.
 */
export async function putObject(
  key: string,
  body: Buffer | string | Uint8Array,
  contentType: string
) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  return s3Client.send(command);
}

/**
 * Download a file from the R2 bucket.
 */
export async function getObject(key: string): Promise<Buffer> {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  const response = await s3Client.send(command);
  if (!response.Body) {
    throw new Error(`Object body is empty for key: ${key}`);
  }
  // Convert S3 body stream to a Buffer
  const bytes = await response.Body.transformToByteArray();
  return Buffer.from(bytes);
}

/**
 * Helper to upload a JSON object to R2.
 */
export async function putJson(key: string, data: unknown) {
  const body = JSON.stringify(data);
  return putObject(key, body, "application/json");
}

/**
 * Helper to download and parse a JSON object from R2.
 */
export async function getJson<T>(key: string): Promise<T> {
  const buffer = await getObject(key);
  const text = buffer.toString("utf-8");
  return JSON.parse(text) as T;
}

/**
 * Copy an object within the same bucket (e.g. from pending/ to cards/).
 */
export async function copyObject(sourceKey: string, destKey: string) {
  const command = new CopyObjectCommand({
    Bucket: bucketName,
    CopySource: `${bucketName}/${sourceKey}`,
    Key: destKey,
  });
  return s3Client.send(command);
}

/**
 * Generate a pre-signed URL for direct browser uploads (PUT request).
 */
export async function createSignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 3600
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Delete an object from R2.
 */
export async function deleteObject(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  return s3Client.send(command);
}

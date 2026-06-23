import crypto from "crypto";

/**
 * Generates the SHA-256 digest in Base64 for a given JSON body.
 */
export function generateDigest(body: any): string {
  const bodyString = typeof body === "string" ? body : JSON.stringify(body);
  return crypto.createHash("sha256").update(bodyString, "utf8").digest("base64");
}

export interface SignatureParams {
  clientId: string;
  requestId: string;
  timestamp: string;
  targetPath: string; // e.g., "/checkout/v1/payment" or "/api/doku/webhook"
  digest: string;
  secretKey: string;
}

/**
 * Generates the symmetric HMAC-SHA256 signature required by Doku Checkout.
 */
export function generateDokuSignature({
  clientId,
  requestId,
  timestamp,
  targetPath,
  digest,
  secretKey,
}: SignatureParams): string {
  const stringToSign =
    `Client-Id:${clientId}\n` +
    `Request-Id:${requestId}\n` +
    `Request-Timestamp:${timestamp}\n` +
    `Request-Target:${targetPath}\n` +
    `Digest:${digest}`;

  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(stringToSign)
    .digest("base64");

  return `HMACSHA256=${hmac}`;
}

/**
 * Verifies if the signature sent by Doku matches our locally generated signature.
 */
export function verifyDokuSignature({
  clientId,
  requestId,
  timestamp,
  targetPath,
  digest,
  secretKey,
  signatureToVerify,
}: SignatureParams & { signatureToVerify: string }): boolean {
  const expectedSignature = generateDokuSignature({
    clientId,
    requestId,
    timestamp,
    targetPath,
    digest,
    secretKey,
  });

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signatureToVerify, "utf8"),
      Buffer.from(expectedSignature, "utf8")
    );
  } catch (e) {
    // Fallback if lengths differ or in case of timingSafeEqual error
    return signatureToVerify === expectedSignature;
  }
}

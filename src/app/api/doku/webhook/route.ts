import { NextResponse } from "next/server";
import { getJson } from "@/lib/r2/client";
import { verifyDokuSignature, generateDigest } from "@/lib/doku/signature";
import { publishCard } from "@/lib/publisher/publish-card";

export async function POST(req: Request) {
  const secretKey = process.env.DOKU_SECRET_KEY;
  if (!secretKey) {
    console.error("[Doku Webhook] DOKU_SECRET_KEY environment variable is not configured.");
    return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
  }

  try {
    const headers = req.headers;
    const clientId = headers.get("client-id");
    const requestId = headers.get("request-id");
    const timestamp = headers.get("request-timestamp");
    const signatureHeader = headers.get("signature") || headers.get("x-signature");

    if (!clientId || !requestId || !timestamp || !signatureHeader) {
      console.error("[Doku Webhook] Missing required authentication headers.");
      return NextResponse.json({ error: "Missing headers" }, { status: 400 });
    }

    // 1. Read Raw Body for Digest Calculation
    const rawBody = await req.text();
    const digest = generateDigest(rawBody);

    // 2. Resolve target path
    const urlObj = new URL(req.url);
    const targetPath = urlObj.pathname;

    // 3. Verify Doku Signature
    const isSignatureValid = verifyDokuSignature({
      clientId,
      requestId,
      timestamp,
      targetPath,
      digest,
      secretKey,
      signatureToVerify: signatureHeader,
    });

    if (!isSignatureValid) {
      console.error(`[Doku Webhook] Signature verification failed. Got: ${signatureHeader}`);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 4. Parse Webhook Notification Body
    const payload = JSON.parse(rawBody);
    const orderId = payload?.order?.invoice_number;
    const transactionStatus = payload?.transaction?.status;

    if (!orderId) {
      console.error("[Doku Webhook] Missing order invoice number in payload.");
      return NextResponse.json({ error: "Missing invoice_number" }, { status: 400 });
    }

    console.log(`[Doku Webhook] Received status notification for Order: ${orderId}, Status: ${transactionStatus}`);

    // Check if transaction is successful
    if (transactionStatus?.toUpperCase() === "SUCCESS") {
      // Load order status first to check if already published
      const orderKey = `orders/${orderId}.json`;
      const order = await getJson<any>(orderKey);

      if (!order) {
        console.error(`[Doku Webhook] Order ${orderId} not found in database.`);
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      if (order.status === "published") {
        console.log(`[Doku Webhook] Order ${orderId} is already published. Acknowledging webhook.`);
        return NextResponse.json({ status: "ALREADY_PUBLISHED" });
      }

      // Publish the card
      console.log(`[Doku Webhook] Order ${orderId} payment successful. Publishing card...`);
      await publishCard(orderId);
      console.log(`[Doku Webhook] Order ${orderId} published successfully.`);
    } else {
      console.log(`[Doku Webhook] Transaction status is not SUCCESS (got: ${transactionStatus}). Ignoring.`);
    }

    // Always acknowledge with 200 OK
    return NextResponse.json({ status: "OK" });
  } catch (error: any) {
    console.error("[Doku Webhook] Internal server error handling webhook:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

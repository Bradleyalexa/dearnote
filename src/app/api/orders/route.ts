import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { CardDraftSchema } from "@/lib/schemas/card-draft";
import { putJson, getObject } from "@/lib/r2/client";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { createCheckoutPayment } from "@/lib/doku/client";
import { publishCard } from "@/lib/publisher/publish-card";

export async function POST(req: NextRequest) {
  // --- Rate Limiting: max 5 orders per IP per 10 minutes ---
  const ip = getClientIp(req);
  const rl = rateLimit(`orders:${ip}`, { limit: 5, windowSeconds: 600 });
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  try {
    const body = await req.json();
    const { paymentGroup, draft } = body;

    // 1. Validate Payment Group
    if (paymentGroup !== "qris_ewallet" && paymentGroup !== "bank_card") {
      return NextResponse.json(
        { error: "Invalid payment group. Must be 'qris_ewallet' or 'bank_card'" },
        { status: 400 }
      );
    }

    // 2. Validate Card Draft
    const parseResult = CardDraftSchema.safeParse(draft);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid card draft content", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    // 3. Calculate Pricing Server-Side (Flat Rp8.000)
    const amount = 8000;

    // 4. Generate Identifiers
    const orderId = `order_${nanoid(8)}`;

    // Generate unique 6-digit numeric card ID
    let cardId = "";
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 5) {
      let tempId = "";
      for (let i = 0; i < 6; i++) {
        tempId += Math.floor(Math.random() * 10).toString();
      }
      try {
        await getObject(`cards/${tempId}/status.json`);
        attempts++;
      } catch (err) {
        cardId = tempId;
        isUnique = true;
      }
    }

    if (!cardId) {
      cardId = Math.floor(100000 + Math.random() * 900000).toString();
    }

    const createdAt = new Date().toISOString();

    // 5. Call Doku Checkout API to generate real hosted checkout URL or bypass it
    let paymentUrl = "";
    const isPaymentDisabled = process.env.DISABLE_PAYMENT === "true" || process.env.NEXT_PUBLIC_DISABLE_PAYMENT === "true";
    if (isPaymentDisabled) {
      paymentUrl = `/success/${orderId}`;
    } else {
      try {
        const dokuResult = await createCheckoutPayment({
          amount,
          invoiceNumber: orderId,
          paymentGroup,
        });
        paymentUrl = dokuResult.paymentUrl;
      } catch (err: any) {
        console.error("Failed to generate Doku payment link:", err);
        return NextResponse.json(
          { error: "Failed to generate Doku payment session" },
          { status: 500 }
        );
      }
    }

    // 6. Build Order JSON
    const orderData = {
      orderId,
      cardId,
      amount,
      currency: "IDR",
      paymentGroup,
      status: "pending_payment",
      paymentProvider: isPaymentDisabled ? "none" : "doku",
      paymentUrl,
      createdAt,
      updatedAt: createdAt,
    };

    // 7. Save data to R2 Bucket (Acting as S3 File Database)
    const draftKey = `pending/${orderId}/draft.json`;
    const orderKey = `orders/${orderId}.json`;

    // Save draft JSON
    await putJson(draftKey, parseResult.data);
    // Save order JSON
    await putJson(orderKey, orderData);

    // Auto-publish if payment is bypassed
    if (isPaymentDisabled) {
      try {
        console.log(`[Bypass] Auto-publishing order ${orderId} immediately...`);
        await publishCard(orderId);
      } catch (pubErr) {
        console.error("[Bypass] Failed to auto-publish bypassed card:", pubErr);
        return NextResponse.json(
          { error: "Failed to auto-publish card" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      orderId,
      cardId,
      amount,
      currency: "IDR",
      paymentUrl: orderData.paymentUrl,
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

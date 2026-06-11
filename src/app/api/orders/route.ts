import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { CardDraftSchema } from "@/lib/schemas/card-draft";
import { putJson } from "@/lib/r2/client";

export async function POST(req: NextRequest) {
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

    // 3. Calculate Pricing Server-Side
    const qrisPrice = parseInt(process.env.CARD_PRICE_QRIS_EWALLET_IDR || "3000", 10);
    const bankPrice = parseInt(process.env.CARD_PRICE_BANK_CARD_IDR || "8000", 10);
    const amount = paymentGroup === "qris_ewallet" ? qrisPrice : bankPrice;

    // 4. Generate Identifiers
    const orderId = `order_${nanoid(8)}`;
    const cardId = `card_${nanoid(8)}`;
    const createdAt = new Date().toISOString();

    // 5. Build Order JSON
    const orderData = {
      orderId,
      cardId,
      amount,
      currency: "IDR",
      paymentGroup,
      status: "pending_payment",
      paymentProvider: "doku",
      paymentUrl: `/success/${orderId}?simulate=true`, // Simulated redirection for V0
      createdAt,
      updatedAt: createdAt,
    };

    // 6. Save data to R2 Bucket (Acting as S3 File Database)
    const draftKey = `pending/${orderId}/draft.json`;
    const orderKey = `orders/${orderId}.json`;

    // Save draft JSON
    await putJson(draftKey, parseResult.data);
    // Save order JSON
    await putJson(orderKey, orderData);

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
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getJson } from "@/lib/r2/client";
import { publishCard } from "@/lib/publisher/publish-card";

/**
 * Internal simulation endpoint — wraps the publish flow so the browser
 * never needs to know ADMIN_SECRET.
 *
 * Only active when NODE_ENV !== "production" OR when ENABLE_SIMULATE=true
 * is explicitly set. This prevents accidental exposure in production.
 */
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ orderId: string }> }
) {
  const isProduction = process.env.NODE_ENV === "production";
  const simulateEnabled = process.env.ENABLE_SIMULATE === "true";

  if (isProduction && !simulateEnabled) {
    return NextResponse.json(
      { error: "Simulation mode is disabled in production." },
      { status: 403 }
    );
  }

  const params = await props.params;
  const orderId = params.orderId;

  if (!orderId) {
    return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
  }

  const orderKey = `orders/${orderId}.json`;

  try {
    const order = await getJson<any>(orderKey);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "pending_payment") {
      // Already published or failed — just return current state
      const publicBaseUrl = process.env.PUBLIC_CARD_BASE_URL || "";
      const cleanBaseUrl = publicBaseUrl.endsWith("/")
        ? publicBaseUrl.slice(0, -1)
        : publicBaseUrl;

      return NextResponse.json({
        orderId: order.orderId,
        status: order.status,
        cardUrl: order.status === "published"
          ? `${cleanBaseUrl}/cards/${order.cardId}/notes.html`
          : undefined,
        qrPngUrl: order.status === "published"
          ? `${cleanBaseUrl}/cards/${order.cardId}/qr.png`
          : undefined,
        qrSvgUrl: order.status === "published"
          ? `${cleanBaseUrl}/cards/${order.cardId}/qr.svg`
          : undefined,
      });
    }

    console.log(`[Simulate] Triggering publish for order ${orderId}...`);
    const cardUrl = await publishCard(orderId);

    const updatedOrder = await getJson<any>(orderKey);
    const publicBaseUrl = process.env.PUBLIC_CARD_BASE_URL || "";
    const cleanBaseUrl = publicBaseUrl.endsWith("/")
      ? publicBaseUrl.slice(0, -1)
      : publicBaseUrl;

    return NextResponse.json({
      orderId: updatedOrder.orderId,
      status: updatedOrder.status,
      cardUrl,
      qrPngUrl: `${cleanBaseUrl}/cards/${updatedOrder.cardId}/qr.png`,
      qrSvgUrl: `${cleanBaseUrl}/cards/${updatedOrder.cardId}/qr.svg`,
    });
  } catch (error: any) {
    console.error(`[Simulate] Error for order ${orderId}:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

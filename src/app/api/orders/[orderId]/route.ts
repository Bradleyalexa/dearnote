import { NextRequest, NextResponse } from "next/server";
import { getJson } from "@/lib/r2/client";
import { publishCard } from "@/lib/publisher/publish-card";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ orderId: string }> }
) {
  const params = await props.params;
  const orderId = params.orderId;
  const { searchParams } = new URL(req.url);
  const simulate = searchParams.get("simulate") === "true";

  if (!orderId) {
    return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
  }

  // --- Guard: simulate mode requires ADMIN_SECRET ---
  if (simulate) {
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) {
      // If ADMIN_SECRET is not configured in env, simulation is always disabled.
      return NextResponse.json({ error: "Simulation mode is not available." }, { status: 403 });
    }
    const authHeader = req.headers.get("authorization");
    const providedSecret = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    if (providedSecret !== adminSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const orderKey = `orders/${orderId}.json`;

  try {
    // Load order data from R2
    const order = await getJson<any>(orderKey);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // SIMULATION MODE: If pending_payment and simulate=true, automatically trigger publish
    if (order.status === "pending_payment" && simulate) {
      console.log(`[Order API] Simulating payment completion for order ${orderId}...`);

      // Call publisher synchronously
      const cardUrl = await publishCard(orderId);

      // Reload order JSON from storage after publishing
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
    }

    // Standard Response
    if (order.status === "published") {
      const publicBaseUrl = process.env.PUBLIC_CARD_BASE_URL || "";
      const cleanBaseUrl = publicBaseUrl.endsWith("/")
        ? publicBaseUrl.slice(0, -1)
        : publicBaseUrl;

      return NextResponse.json({
        orderId: order.orderId,
        status: order.status,
        cardUrl: `${cleanBaseUrl}/cards/${order.cardId}/notes.html`,
        qrPngUrl: `${cleanBaseUrl}/cards/${order.cardId}/qr.png`,
        qrSvgUrl: `${cleanBaseUrl}/cards/${order.cardId}/qr.svg`,
      });
    }

    // Pending payment response
    return NextResponse.json({
      orderId: order.orderId,
      status: order.status,
    });
  } catch (error: any) {
    console.error(`Error loading order ${orderId}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

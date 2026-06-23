import { generateDigest, generateDokuSignature } from "./signature";
import crypto from "crypto";

export interface CreateCheckoutParams {
  amount: number;
  invoiceNumber: string;
  paymentGroup: "qris_ewallet" | "bank_card";
}

/**
 * Creates a Doku Checkout payment session and returns the hosted payment URL.
 */
export async function createCheckoutPayment({
  amount,
  invoiceNumber,
  paymentGroup,
}: CreateCheckoutParams): Promise<{ paymentUrl: string; expiredDate: string }> {
  const clientId = process.env.DOKU_CLIENT_ID;
  const secretKey = process.env.DOKU_SECRET_KEY;
  const apiBaseUrl = process.env.DOKU_API_BASE_URL || "https://api-sandbox.doku.com";

  if (!clientId || !secretKey) {
    throw new Error("Missing DOKU_CLIENT_ID or DOKU_SECRET_KEY in environment variables.");
  }

  const targetPath = "/checkout/v1/payment";
  const url = `${apiBaseUrl}${targetPath}`;

  // Configure payment methods allowed for each category
  const paymentMethodTypes =
    paymentGroup === "qris_ewallet"
      ? ["QRIS", "EMONEY_OVO", "EMONEY_SHOPEE_PAY", "EMONEY_DOKU"]
      : ["CREDIT_CARD"];

  // 1. Prepare Request Body
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const cleanAppUrl = appUrl.endsWith("/") ? appUrl.slice(0, -1) : appUrl;

  const body = {
    order: {
      amount,
      invoice_number: invoiceNumber,
      callback_url: `${cleanAppUrl}/success/${invoiceNumber}`,
    },
    payment: {
      payment_due_date: 60, // Link expires in 60 minutes
      payment_method_types: paymentMethodTypes,
    },
  };

  const bodyString = JSON.stringify(body);

  // 2. Generate header attributes
  const requestId = crypto.randomUUID();
  // Doku expects UTC format in yyyy-MM-ddTHH:mm:ssZ (without milliseconds)
  const timestamp = new Date().toISOString().replace(/\.\d{3}/, "");

  // 3. Generate Digest and Signature
  const digest = generateDigest(bodyString);
  const signature = generateDokuSignature({
    clientId,
    requestId,
    timestamp,
    targetPath,
    digest,
    secretKey,
  });

  // 4. Call Doku API
  console.log(`[Doku Client] Initiating checkout for Invoice: ${invoiceNumber}, Amount: ${amount}`);
  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Client-Id": clientId,
      "Request-Id": requestId,
      "Request-Timestamp": timestamp,
      "Signature": signature,
    },
    body: bodyString,
  });

  // Fallback: If payment channel fails (e.g., inactive channel in sandbox), try again without restrictions
  if (!response.ok) {
    const errorText = await response.text();
    console.warn(`[Doku Client] Restricted API call failed (${response.status}): ${errorText}. Retrying without payment channel restrictions...`);

    const fallbackBody = {
      order: {
        amount,
        invoice_number: invoiceNumber,
        callback_url: `${cleanAppUrl}/success/${invoiceNumber}`,
      },
      payment: {
        payment_due_date: 60,
      },
    };
    const fallbackBodyString = JSON.stringify(fallbackBody);
    const fallbackDigest = generateDigest(fallbackBodyString);
    const fallbackSignature = generateDokuSignature({
      clientId,
      requestId,
      timestamp,
      targetPath,
      digest: fallbackDigest,
      secretKey,
    });

    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": clientId,
        "Request-Id": requestId,
        "Request-Timestamp": timestamp,
        "Signature": fallbackSignature,
      },
      body: fallbackBodyString,
    });

    if (!response.ok) {
      const finalErrorText = await response.text();
      console.error(`[Doku Client] Final API Error (Status ${response.status}):`, finalErrorText);
      throw new Error(`Doku API responded with status ${response.status}: ${finalErrorText}`);
    }
  }

  const responseData = await response.json();
  const actualResponse = responseData?.response || responseData;
  const paymentUrl = actualResponse?.payment?.url;
  const expiredDate = actualResponse?.payment?.expired_date;

  if (!paymentUrl) {
    console.error("[Doku Client] Unexpected Doku response schema:", responseData);
    throw new Error("Doku response did not contain payment URL");
  }

  return { paymentUrl, expiredDate };
}

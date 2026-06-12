import { NextRequest, NextResponse } from "next/server";

/**
 * Allowed origins for CORS.
 * - APP_URL: the main app domain (e.g. https://dearnote.asia)
 * - PUBLIC_CARD_BASE_URL: the public card subdomain (e.g. https://pub.dearnote.asia)
 * - localhost is allowed in non-production for local development.
 */
function getAllowedOrigins(): string[] {
  const origins: string[] = [];

  if (process.env.APP_URL) {
    origins.push(process.env.APP_URL.replace(/\/$/, ""));
  }
  if (process.env.PUBLIC_CARD_BASE_URL) {
    origins.push(process.env.PUBLIC_CARD_BASE_URL.replace(/\/$/, ""));
  }
  if (process.env.NODE_ENV !== "production") {
    origins.push("http://localhost:3000");
    origins.push("http://127.0.0.1:3000");
  }

  return origins;
}

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowed = getAllowedOrigins();
  const isAllowed = origin !== null && allowed.includes(origin);

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin! : "null",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400", // Cache preflight for 24h
  };
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only apply CORS logic to API routes
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Attach CORS headers to all API responses
  const response = NextResponse.next();
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: "/api/:path*",
};

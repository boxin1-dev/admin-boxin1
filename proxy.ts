import type { auth } from "@/src/lib/auth";
import { betterFetch } from "@better-fetch/fetch";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type Session = typeof auth.$Infer.Session;

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "", // Forward the cookies from the request
      },
    }
  );

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/",
};

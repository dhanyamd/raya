import { NextResponse, type NextRequest } from "next/server";

export default async function authMiddleware(request: NextRequest) {
    const publicPaths = ["/sign-in", "/sign-up"];
    if (publicPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
        return NextResponse.next();
    }

    try {
        // Better-auth usually exposes /api/auth/get-session or /api/auth/session
        // Checking the docs/code, usually it's get-session
        const res = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
            headers: {
                cookie: request.headers.get("cookie") || "",
            },
        });
        const session = await res.json();

        if (!session) {
            return NextResponse.redirect(new URL("/sign-in", request.url));
        }
        return NextResponse.next();
    } catch (error) {
        console.error("Middleware Auth Error:", error);
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};

// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Check if the current path is the root path.
    if (req.nextUrl.pathname === "/") {
      // If it is, create the full URL for the /unauthorized page and redirect.
      const url = req.nextUrl.clone();
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

    // For any other protected route, allow the request to proceed.
    // This part only runs if the user is authenticated.
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // This logic checks if the user is authorized for ANY page
        // matched by the config below.
        if (!token) {
          return false;
        }

        const now = Math.floor(Date.now() / 1000);
        if (token.exp && now > token.exp) {
          console.warn("Token expired");
          return false;
        }

        return !!token.accessToken;
      },
    },
    pages: {
      // If the `authorized` callback returns false, redirect to this page.
      signIn: "/unauthorized",
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
);

// This config remains the same. It ensures the middleware runs on the root path "/"
// and all other paths except the excluded ones.
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|auth/login|unauthorized).*)",
  ],
};

// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // This function will only run on routes that match the matcher.
    // You can add logic here if you need to perform actions on protected routes.
    // For now, just letting it pass is fine.
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // This logic is now only for protected pages.
        if (!token) {
          return false;
        }

        const now = Math.floor(Date.now() / 1000);
        if (token.exp && now > token.exp) {
          console.warn("Token expired");
          return false;
        }

        // You can keep the more detailed checks if you want, but the
        // presence of the token is often enough here.
        return !!token.accessToken;
      },
    },
    pages: {
      // Redirect unauthorized users (on protected pages) to this route.
      signIn: "/unauthorized",
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
);

// This is the crucial part!
export const config = {
  // The matcher defines which routes the middleware will run on.
  // This regex matches all paths EXCEPT for the ones specified.
  // We are excluding:
  // - /api routes
  // - /_next/static and /_next/image (Next.js internals)
  // - favicon.ico
  // - /auth/login (your login page)
  // - /unauthorized (your sign-in page)
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|auth/login|unauthorized).*)",
  ],
};

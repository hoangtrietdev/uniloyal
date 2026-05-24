import { NextRequest, NextResponse } from 'next/server';

// Middleware runs on Edge and keeps public routes open.
// Client-side auth handles the session state for this demo.

const PUBLIC_PATHS = ['/'];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/icons') ||
    pathname === '/sw.js' ||
    pathname === '/manifest.json' ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Public paths always accessible
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // For protected routes, the client-side auth handles redirection.
  // Middleware simply passes through; AuthGuard components handle it.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

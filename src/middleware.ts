import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Log all requests
  console.log(`[${request.method}] ${request.nextUrl.pathname}`);

  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/register';

  // Get the token from the cookies
  const token = request.cookies.get('session')?.value;

  // Redirect logic
  if (isPublicPath && token) {
    // If user is logged in and tries to access login/register, redirect to dashboard
    console.log('User is logged in, redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!isPublicPath && !token) {
    // If user is not logged in and tries to access protected route, redirect to login
    console.log('User is not logged in, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/screeners/:path*',
    '/login',
    '/register',
  ],
}; 
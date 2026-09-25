import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const authRoutes = ['/admin/login'];
const protectedRoutes = ['/admin/dashboard', '/admin/dashboard/media', '/admin/dashboard/collections', '/admin/dashboard/orders', '/admin/dashboard/settings'];
const apiAuthRoutes = ['/api/auth'];
const apiProtectedRoutes = ['/api/media/upload', '/api/checkout', '/api/signed-url'];

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isApiAuthRoute = apiAuthRoutes.some(route => pathname.startsWith(route));
  const isApiProtectedRoute = apiProtectedRoutes.some(route => pathname.startsWith(route));

  if (isAuthRoute) {
    if (session?.user) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (isProtectedRoute || isApiProtectedRoute) {
    if (!session?.user) {
      if (isApiProtectedRoute) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith('/api/media/') && pathname.endsWith('/serve')) {
    if (!session?.user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
  }

  const response = NextResponse.next();

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/auth/:path*',
    '/api/media/upload',
    '/api/checkout',
    '/api/signed-url',
    '/api/media/:id/serve',
  ],
};
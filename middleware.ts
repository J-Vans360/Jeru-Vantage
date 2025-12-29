import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // If user is authenticated and trying to access login/register/signup, redirect to role-based redirect page
    if (token && (pathname === '/login' || pathname === '/register' || pathname === '/signup')) {
      return NextResponse.redirect(new URL('/redirect', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Public routes - allow without auth
        if (
          pathname === '/' ||
          pathname === '/login' ||
          pathname === '/register' ||
          pathname === '/signup' ||
          pathname === '/setup-sponsor' ||
          pathname === '/setup-admin' ||
          pathname === '/pricing' ||
          pathname === '/forgot-password' ||
          pathname.startsWith('/reset-password') ||
          pathname.startsWith('/api/auth') ||
          pathname.startsWith('/api/schools/validate') ||
          pathname.startsWith('/api/codes/validate') ||
          pathname.startsWith('/api/debug')
        ) {
          return true;
        }

        // Protected routes - require auth
        return !!token;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     * - svg, png, jpg, ico files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.ico$|.*\\.webp$).*)',
  ],
};

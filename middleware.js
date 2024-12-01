// middleware.js
import { NextResponse } from 'next/server';
import { auth } from '@/config/firebase';
import { cookies } from 'next/headers';

export async function middleware(request) {
  const session = cookies().get('session')?.value;

  // Protect all routes under /dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      await auth().verifySessionCookie(session, true);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // If user is logged in and tries to access login page, redirect to dashboard
  if (request.nextUrl.pathname === '/' && session) {
    try {
      await auth().verifySessionCookie(session, true);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (error) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
};
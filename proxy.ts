import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  if (!request.cookies.get('tahfidz_admin_session')) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/sign-in';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/students/:path*',
    '/setoran/:path*',
    '/reports/:path*',
    '/settings/:path*',
    '/manage/:path*',
  ],
};

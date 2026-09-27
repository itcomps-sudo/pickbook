import { NextResponse, type NextRequest } from 'next/server';
import { COOKIE, sessionToken } from './lib/auth';

export async function middleware(req: NextRequest) {
  // No passcode set = app is open (handy for local dev).
  if (!process.env.APP_PASSCODE) return NextResponse.next();

  const token = req.cookies.get(COOKIE)?.value;
  if (token && token === (await sessionToken())) return NextResponse.next();

  if (req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = '/login';
  url.search = '';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!login|api/login|api/odds/refresh|_next|manifest.webmanifest|sw.js|icons|favicon.ico).*)'],
};

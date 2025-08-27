import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { PATHS } from './app/paths';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ ...options, name, value });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ ...options, name, value });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ ...options, name, value: '' });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.remove({ ...options, name });
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session && request.nextUrl.pathname.startsWith(PATHS.app)) {
    return NextResponse.redirect(new URL(PATHS.login, request.url));
  }

  if (session && (request.nextUrl.pathname === PATHS.login || request.nextUrl.pathname === PATHS.signup)) {
    return NextResponse.redirect(new URL(PATHS.app, request.url));
  }

  return response;
}

export const config = {
  matcher: ['/app/:path*', '/login', '/signup'],
};

import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

import { PATHS } from './app/paths';

export async function middleware(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
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

  return supabaseResponse;
}

export const config = {
  matcher: ['/app/:path*', '/login', '/signup'],
};

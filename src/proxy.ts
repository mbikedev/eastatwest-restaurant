import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  // Simplified proxy without Supabase createServerClient to avoid
  // Netlify edge runtime compatibility issues with cookie iteration

  // Authentication checks will be handled in individual pages/routes
  // This prevents the "object is not iterable" error in Netlify edge functions

  // WordPress URL redirects are now handled by _redirects file to avoid redirect chains
  // that could negatively impact Google Search Console indexing

  return NextResponse.next({
    request,
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Simplified middleware without Supabase createServerClient to avoid
  // Netlify edge runtime compatibility issues with cookie iteration

  // Authentication checks will be handled in individual pages/routes
  // This prevents the "object is not iterable" error in Netlify edge functions

  const { pathname } = request.nextUrl

  // Block WordPress URLs and redirect to home
  const wordpressPaths = [
    '/wp-admin',
    '/wp-login.php',
    '/wp-login',
    '/xmlrpc.php',
    '/wp-content',
    '/wp-includes',
    '/wp-json',
    '/index.php'
  ]

  // Check if path starts with any WordPress path
  if (wordpressPaths.some(wpPath => pathname.startsWith(wpPath))) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url, 301)
  }

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
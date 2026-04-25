import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          supabaseResponse.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Protected paths mapping
  const PROTECTED_ROUTES = ['/studio-town', '/studio-main', '/shepherd', '/control']
  const isProtectedRoute = PROTECTED_ROUTES.some(route => path.startsWith(route))

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isProtectedRoute) {
    // Only fetch user role if they are trying to access a protected route
    const { data: dbUser } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (dbUser) {
      const role = dbUser.role
      // basic RBAC enforcement
      if (path.startsWith('/studio-town') && role !== 'media_town' && role !== 'admin') {
         return NextResponse.redirect(new URL('/', request.url))
      }
      if (path.startsWith('/studio-main') && role !== 'media_main' && role !== 'admin') {
         return NextResponse.redirect(new URL('/', request.url))
      }
      if (path.startsWith('/shepherd') && role !== 'pastor' && role !== 'admin') {
         return NextResponse.redirect(new URL('/', request.url))
      }
      if (path.startsWith('/control') && role !== 'admin') {
         return NextResponse.redirect(new URL('/', request.url))
      }
    } else {
        // user exists in auth but not in users table, default deny
        return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // If user is logged in, hide login page
  if (user && path === '/login') {
     const { data: dbUser } = await supabase.from('users').select('role').eq('id', user.id).single()
     if (dbUser) {
        if (dbUser.role === 'admin') return NextResponse.redirect(new URL('/control', request.url))
        if (dbUser.role === 'pastor') return NextResponse.redirect(new URL('/shepherd', request.url))
        if (dbUser.role === 'media_town') return NextResponse.redirect(new URL('/studio-town', request.url))
        if (dbUser.role === 'media_main') return NextResponse.redirect(new URL('/studio-main', request.url))
     }
     return NextResponse.redirect(new URL('/', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

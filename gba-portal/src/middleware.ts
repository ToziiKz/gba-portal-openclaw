import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

type Role = 'viewer' | 'coach' | 'staff' | 'admin'

const roleOrder: Record<Role, number> = {
  viewer: 0,
  coach: 1,
  staff: 2,
  admin: 3,
}

const protectedRoutes: Array<{ prefix: string; minRole: Role }> = [
  { prefix: '/dashboard/acces', minRole: 'admin' },
  { prefix: '/dashboard/validations', minRole: 'admin' },
  { prefix: '/dashboard/staff', minRole: 'admin' },
  { prefix: '/dashboard/licences', minRole: 'staff' },
  { prefix: '/dashboard/stock', minRole: 'staff' },
  { prefix: '/dashboard/relances', minRole: 'staff' },
  { prefix: '/dashboard/effectif', minRole: 'coach' },
]

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
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
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
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
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const pathname = request.nextUrl.pathname
  const protectedMatch = protectedRoutes.find((r) => pathname.startsWith(r.prefix))

  if (protectedMatch) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .single()

    const rawRole = String(profile?.role ?? 'viewer').trim().toLowerCase()
    const role: Role =
      rawRole === 'admin' || rawRole === 'staff' || rawRole === 'coach' || rawRole === 'viewer'
        ? rawRole
        : 'viewer'
    const isActive = profile?.is_active !== false

    if (!isActive || roleOrder[role] < roleOrder[protectedMatch.minRole]) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  } else {
    await supabase.auth.getSession()
  }

  return response
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
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

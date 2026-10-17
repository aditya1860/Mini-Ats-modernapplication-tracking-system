import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  
  const isAuthPage = nextUrl.pathname.startsWith('/login')
  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth')
  const isPublicRoute = isAuthPage || isApiAuthRoute
  
  if (isPublicRoute) return NextResponse.next()
  
  if (!isLoggedIn) {
    const loginUrl = new URL('/login', nextUrl)
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
}

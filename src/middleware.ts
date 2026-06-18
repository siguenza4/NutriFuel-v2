import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export const middleware = auth((req: any) => {
  const session = req.auth
  const pathname = req.nextUrl.pathname

  // Rutas públicas
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (session) {
      // Si ya está logueado, redirige según rol
      const redirectUrl = new URL(
        session.user.role === "COACH" ? "/coach/dashboard" : "/client/home",
        req.nextUrl.origin
      )
      return NextResponse.redirect(redirectUrl)
    }
    return NextResponse.next()
  }

  // Rutas protegidas - requieren autenticación
  if (pathname.startsWith("/coach") || pathname.startsWith("/client")) {
    if (!session) {
      const loginUrl = new URL("/login", req.nextUrl.origin)
      return NextResponse.redirect(loginUrl)
    }

    // Verificar rol
    if (pathname.startsWith("/coach") && session.user.role !== "COACH") {
      return NextResponse.redirect(new URL("/client/home", req.nextUrl.origin))
    }
    if (pathname.startsWith("/client") && session.user.role !== "CLIENT") {
      return NextResponse.redirect(new URL("/coach/dashboard", req.nextUrl.origin))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

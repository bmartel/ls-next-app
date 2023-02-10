import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  if (req.nextUrl.href.includes('/_next/static/js/')) {
    return NextResponse.rewrite(
      req.nextUrl.href.replace('/_next/static/js/', '/static/js/'),
    )
  }

  return NextResponse.next()
}

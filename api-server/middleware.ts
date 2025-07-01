// api-server/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Agregamos headers CORS
  res.headers.set('Access-Control-Allow-Origin', '*'); // ⚠️ Podés reemplazar '*' por tu dominio
  res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return res;
}

// Aplica solo a las rutas API
export const config = {
  matcher: '/api/:path*',
};

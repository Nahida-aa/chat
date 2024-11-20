import NextAuth from 'next-auth';

import { authConfig } from '@/app/(auth)/auth.config';
import type { NextRequest } from 'next/server';

// export default NextAuth(authConfig).auth;
async function middleware(
  req: NextRequest,
) {
  
}
export default middleware;

export const config = {
  matcher: ['/', '/:id', '/api/:path*', '/login', '/register'],
};

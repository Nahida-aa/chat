import NextAuth from 'next-auth';

import { authConfig } from '@/app/(auth)/auth.config';

// export default NextAuth(authConfig).auth;
async function middleware(
  req
) {
  
}
export default middleware;

export const config = {
  matcher: ['/', '/:id', '/api/:path*', '/login', '/register'],
};

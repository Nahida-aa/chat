import { getDefaultAvatar } from '@/features/auth/utils/avatar'
import type { AuthUser } from '@/features/auth/auth'
import { getSession } from '@/features/auth/action'
import { headers } from 'next/headers'
import type z from 'zod'

// 小工具
export const withAuth =
  <Args extends unknown[], R>(fn: (userId: string, ...args: Args) => R | Promise<R>) =>
  async (...args: Args) => {
    const session = await getSession()
    console.log('session:', session)
    if (!session) throw new Error('NoAuth')
    const userId = session.user.id
    return await fn(userId, ...args)
  }

export const withAvatar = <Args extends unknown[], R>(
  fn: (userId: string, image: string, ...args: Args) => R | Promise<R>,
) => {
  return async (...args: Args) => {
    const session = await getSession()
    console.log('session:', session)
    if (!session) throw new Error('NoAuth')
    const userId = session.user.id
    const image = session.user.image || getDefaultAvatar(session.user.username!)
    return await fn(userId, image, ...args)
  }
}
export const withUser = <Args extends unknown[], R>(
  fn: (user: AuthUser, ...args: Args) => R | Promise<R>,
) => {
  return async (...args: Args) => {
    const session = await getSession()
    console.log('session:', session)
    if (!session) throw new Error('NoAuth')
    const user = session.user
    return await fn(user, ...args)
  }
}
export const withZod =
  <S extends z.ZodType>(s: S) =>
  <R>(fn: (arg: z.output<S>) => R) =>
  (arg: z.input<S>) =>
    fn(s.parse(arg))

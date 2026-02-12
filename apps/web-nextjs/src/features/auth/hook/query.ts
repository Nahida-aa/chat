'use client'
import { sessionQuery } from '@/features/auth/hook/rq'
import { useQuery } from '@tanstack/react-query'

export const useSession = () => {
  const { data: session, ...ret } = useQuery(sessionQuery())
  return {
    session,
    ...ret,
  }
}

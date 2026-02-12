"use server";
import { auth, type AuthSession } from "./auth";
import { headers } from "next/headers";

export const getSession = async () => {
  const session = await auth.api.getSession({ headers: await headers() }); // pass the headers
  // session?.user
  return session as AuthSession | null;
};
// export type _AuthSession = Awaited<ReturnType<typeof getSession>>;
// // 移除 null/undefined 分支, 将 .user.username 修改为 非 null
// // export type AuthSession = NonNullable<_AuthSession>;
// export type AuthUser = NonNullable<_AuthSession>["user"] & { username: string };
// export type AuthSession = Omit<NonNullable<_AuthSession>, "user"> & { user: AuthUser };

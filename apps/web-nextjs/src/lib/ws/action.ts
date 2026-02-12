"use server";

import { isOnline } from "@/lib/ws/server";

export const getUserStatus = async (id: string) => {
  return isOnline(id) ? "online" : "offline";
};
export type UserStatus = Awaited<ReturnType<typeof getUserStatus>>;
export const listUserStatus = async (ids: string[]) => {
  const statuses = await Promise.all(ids.map(getUserStatus));
  return ids.map((id, i) => ({ userId: id, status: statuses[i] }));
};
export type ListUserStatusOut = Awaited<ReturnType<typeof listUserStatus>>;

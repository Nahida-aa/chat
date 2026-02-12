"use server";

import { isOnline } from "@/lib/ws/server";
import type { DemoMessage } from "@/lib/ws/types";

export const getUserStatus = async (id: string) => {
  return isOnline(id) ? "online" : "offline";
};
export type UserStatus = Awaited<ReturnType<typeof getUserStatus>>;
export const listUserStatus = async (ids: string[]) => {
  const statuses = await Promise.all(ids.map(getUserStatus));
  return ids.map((id, i) => ({ userId: id, status: statuses[i] }));
};
export type ListUserStatusOut = Awaited<ReturnType<typeof listUserStatus>>;


export const testSendToAll = async (msg: DemoMessage) => {
  if (globalThis.io) {
    globalThis.io.emit("demoMsg", msg);
    return true;
  }
  return false;
}
export const listOnlineUsers = async () => {
  return onlineUsers.keys();
}
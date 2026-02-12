import type { MsgOut } from "@/features/community/schema/zod";

export async function send2all(msg: MsgOut) {
  if (io) {
    io.emit("msg", msg);
    return true;
  }
}

export async function send(msg: MsgOut, target: string) {
  if (io) {
    io.to(target).emit("msg", msg);
    return true;
  }
}

export async function send2channel(msg: MsgOut, channelId: string) {
  return await send(msg, `channel_${channelId}`);
}

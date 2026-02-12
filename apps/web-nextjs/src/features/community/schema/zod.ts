import { channelMessage } from "@/features/community/schema/tables";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod/v4";

export const channelMessageInsertZ = createInsertSchema(channelMessage);
export type ChannelMessageInsert = typeof channelMessage.$inferInsert;
export const channelMessageSelectZ = createSelectSchema(channelMessage);
export type ChannelMessageSelect = typeof channelMessage.$inferSelect;
export const channelMessageUpdateSchema = createUpdateSchema(channelMessage);

export const msgInputZ = channelMessageInsertZ
  .pick({
    channelId: true,
    userId: true,
    content: true,
    contentType: true,
    replyToId: true,
    attachments: true,
  })
  .extend({
    communityId: z.string().optional(),
  });
export type MsgInput = z.infer<typeof msgInputZ>;
export const msgOutputZ = channelMessageSelectZ.extend({
  communityId: z.string().optional(),
});
export type MsgOut = z.infer<typeof msgOutputZ>;

export const newMsgInput = (
  channelId: string,
  userId: string,
  content: string,
): MsgInput => ({
  channelId,
  userId,
  content,
});

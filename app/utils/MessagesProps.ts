import { z } from "zod";

export const MessagesSchema = z.object({
  id: z.string(),
  content: z.string(),
  senderId: z.string(),
  sentTime: z.string(),
  type: z.enum(["text", "photo"])
});

export type MessagesType = z.infer<typeof MessagesSchema>;

export interface MessagesInterface {
  id: string;
  content: string;
  senderId: string;
  sentTime: string;
  type: "text" | "photo";
}

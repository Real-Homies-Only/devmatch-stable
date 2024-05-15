import { z } from "zod";

export const BidSchema = z.object({
  id: z.string(),
  bidComment: z.string(),
  projectId: z.string(),
  userId: z.string(),
  userProfilePic: z.string(),
  userUsername: z.string(),
  userDisplayName: z.string()
});

export type BidType = z.infer<typeof BidSchema>;

export interface BidInterface {
  id: string;
  bidComment: string;
  projectId: string;
  userId: string;
  userProfilePic: string;
  userUsername: string;
  userDisplayName: string;
}

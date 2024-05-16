import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  username: z.string(),
  profilePicture: z.string(),
  bio: z.string(),
  location: z.string(),
  userType: z.string(),
  isAdmin: z.boolean()
});

export type UserType = z.infer<typeof UserSchema>;

export interface UserInterface {
  id: string;
  displayName: string;
  username: string;
  profilePicture: string;
  bio: string;
  location: string;
  userType: string;
  isAdmin: boolean;
}

export interface AuthProps {
  user: UserType | null;
}

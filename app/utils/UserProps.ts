import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  profilePicture: z.string(),
  userType: z.string(),
  isAdmin: z.boolean()
});

export type UserType = z.infer<typeof UserSchema>;

export interface UserInterface {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  userType: string;
  isAdmin: string;
}

export interface AuthProps {
  user: UserType | null;
}

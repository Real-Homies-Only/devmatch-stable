import { PrismaClient } from "@prisma/client";
import { getProfilePicture } from "./getProfilePicture";
import { UserType } from "./UserProps";

const prisma = new PrismaClient();

export const getUserData = async (id: string): Promise<UserType | null> => {
  if (!id) {
    throw new Error("ID params not found!");
  } else {
    const user = await prisma.users.findUnique({
      where: {
        id: id
      }
    });
    if (!user) {
      return null;
    } else {
      const profilePicture = await getProfilePicture(user.profilePicture);

      return {
        ...user,
        profilePicture: profilePicture
      };
    }
  }
};

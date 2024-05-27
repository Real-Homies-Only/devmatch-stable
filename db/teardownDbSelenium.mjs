import { PrismaClient } from "@prisma/client";
import admin from "firebase-admin";
import serviceAccount from "../firebase-admin.json" with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const prisma = new PrismaClient();

const teardownDatabase = async () => {
  const listAllUsers = await auth.listUsers();
  const users = listAllUsers.users;
  for (const user of users) {
    await auth.deleteUser(user.uid);
  }
  await prisma.bids.deleteMany();
  await prisma.projects.deleteMany();
  await prisma.users.deleteMany();
  await prisma.ratings.deleteMany();
  await prisma.messages.deleteMany();
  await prisma.task.deleteMany();

  await prisma.$disconnect();
};

teardownDatabase();

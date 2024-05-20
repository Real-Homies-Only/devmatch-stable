import { createUserWithEmailAndPassword } from "firebase/auth";
import { PrismaClient } from "@prisma/client";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: `${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}`,
  projectId: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`,
  storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}`,
  messagingSenderId: `${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}`,
  appId: `${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}`,
  measurementId: `${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}`
};

const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);

const prisma = new PrismaClient();

const clientEmail = "client123@gmail.com";
const developerEmail = "developer123@gmail.com";
const password = "123456";

const setupDatabase = async () => {
  const client = await createUserWithEmailAndPassword(
    firebaseAuth,
    clientEmail,
    password
  );

  await prisma.users.create({
    data: {
      id: client.user.uid,
      username: "client123",
      userType: "Client",
      displayName: "Client 123"
    }
  });

  const developer = await createUserWithEmailAndPassword(
    firebaseAuth,
    developerEmail,
    password
  );

  await prisma.users.create({
    data: {
      id: developer.user.uid,
      username: "developer123",
      userType: "Developer",
      displayName: "Developer 123"
    }
  });

  const project = await prisma.projects.create({
    data: {
      projectName: "Test Project",
      category: "Web Development",
      language: "JavaScript",
      description: "Test Description",
      clientId: client.user.uid
    }
  });

  await prisma.bids.create({
    data: {
      projectId: project.id,
      userId: developer.user.uid,
      bidComment: "Test Bid"
    }
  });
};

setupDatabase();

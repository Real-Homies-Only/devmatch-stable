-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" VARCHAR(14) NOT NULL,
    "userType" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT 'None',
    "bio" VARCHAR(255) NOT NULL DEFAULT 'User has no info',
    "profilePicture" TEXT NOT NULL DEFAULT 'defaultPhoto.png',
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "Users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

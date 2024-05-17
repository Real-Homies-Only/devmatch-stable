-- CreateEnum
CREATE TYPE "Column" AS ENUM ('BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('text', 'photo');

-- AlterTable
ALTER TABLE "Projects" ADD COLUMN     "projectPicture" TEXT NOT NULL DEFAULT 'defaultBanner.png';

-- CreateTable
CREATE TABLE "Messages" (
    "id" VARCHAR(32) NOT NULL,
    "content" TEXT NOT NULL,
    "type" "MessageType" NOT NULL,
    "projectId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "sentTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "column" "Column" NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Messages_id_key" ON "Messages"("id");

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

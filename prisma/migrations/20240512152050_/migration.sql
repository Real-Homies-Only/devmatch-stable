/*
  Warnings:

  - You are about to drop the `ProjectParticipant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProjectParticipant" DROP CONSTRAINT "ProjectParticipant_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectParticipant" DROP CONSTRAINT "ProjectParticipant_userId_fkey";

-- DropTable
DROP TABLE "ProjectParticipant";

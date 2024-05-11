/*
  Warnings:

  - You are about to drop the `ProjectTable` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProjectParticipant" DROP CONSTRAINT "ProjectParticipant_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectTable" DROP CONSTRAINT "ProjectTable_userId_fkey";

-- DropTable
DROP TABLE "ProjectTable";

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "projectManagement" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_id_key" ON "Project"("id");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectParticipant" ADD CONSTRAINT "ProjectParticipant_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

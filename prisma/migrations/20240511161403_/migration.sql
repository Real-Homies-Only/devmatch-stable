/*
  Warnings:

  - The primary key for the `Project` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `projectId` on the `ProjectParticipant` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "ProjectParticipant" DROP CONSTRAINT "ProjectParticipant_projectId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP CONSTRAINT "Project_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Project_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProjectParticipant" DROP COLUMN "projectId",
ADD COLUMN     "projectId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Project_id_key" ON "Project"("id");

-- AddForeignKey
ALTER TABLE "ProjectParticipant" ADD CONSTRAINT "ProjectParticipant_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

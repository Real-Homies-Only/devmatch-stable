/*
  Warnings:

  - You are about to drop the column `position` on the `Projects` table. All the data in the column will be lost.
  - You are about to drop the column `projectManagement` on the `Projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Projects" DROP COLUMN "position",
DROP COLUMN "projectManagement";

/*
  Warnings:

  - You are about to drop the column `firstName` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Users` table. All the data in the column will be lost.
  - Added the required column `displayName` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "displayName" TEXT NOT NULL;

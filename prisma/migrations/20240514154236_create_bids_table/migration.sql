/*
  Warnings:

  - The primary key for the `Bids` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Bids" DROP CONSTRAINT "Bids_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(32),
ALTER COLUMN "projectId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Bids_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Bids_id_seq";

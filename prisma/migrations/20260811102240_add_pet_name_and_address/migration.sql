/*
  Warnings:

  - Added the required column `petName` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `Business` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "petName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "address" TEXT NOT NULL;

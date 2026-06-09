/*
  Warnings:

  - Added the required column `poojaDate` to the `Bill` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdById` on table `Bill` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "BillStatus" AS ENUM ('BOOKED', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Bill" DROP CONSTRAINT "Bill_createdById_fkey";

-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "poojaDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "BillStatus" NOT NULL DEFAULT 'BOOKED',
ALTER COLUMN "createdById" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Bill_poojaDate_idx" ON "Bill"("poojaDate");

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

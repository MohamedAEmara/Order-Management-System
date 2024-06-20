/*
  Warnings:

  - You are about to drop the column `orderOrderId` on the `CartItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_orderOrderId_fkey";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "orderOrderId",
ADD COLUMN     "orderId" TEXT;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE SET NULL ON UPDATE CASCADE;

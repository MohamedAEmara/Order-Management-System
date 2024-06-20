-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "orderOrderId" TEXT;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_orderOrderId_fkey" FOREIGN KEY ("orderOrderId") REFERENCES "Order"("orderId") ON DELETE SET NULL ON UPDATE CASCADE;

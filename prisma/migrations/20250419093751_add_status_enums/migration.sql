/*
  Warnings:

  - The `status` column on the `cartItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `order` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CartItemStatus" AS ENUM ('active', 'wishlist', 'out_of_stock');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'for_payment', 'paid', 'processing', 'on_transit', 'delivered', 'received', 'completed', 'cancelled', 'failed', 'returned', 'refunded');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('cod', 'gcash', 'card', 'bank', 'paypal', 'other');

-- AlterTable
ALTER TABLE "cartItem" DROP COLUMN "status",
ADD COLUMN     "status" "CartItemStatus" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "paymentType" "PaymentType",
DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'pending';

-- CreateIndex
CREATE INDEX "cartItem_status_idx" ON "cartItem"("status");

-- CreateIndex
CREATE INDEX "order_status_idx" ON "order"("status");

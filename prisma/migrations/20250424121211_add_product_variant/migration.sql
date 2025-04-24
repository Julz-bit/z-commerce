/*
  Warnings:

  - You are about to drop the column `attributes` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `files` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `product` table. All the data in the column will be lost.
  - Added the required column `productVariantId` to the `cartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productVariantId` to the `orderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "product_name_idx";

-- DropIndex
DROP INDEX "product_price_idx";

-- AlterTable
ALTER TABLE "cartItem" ADD COLUMN     "productVariantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orderItem" ADD COLUMN     "productVariantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "product" DROP COLUMN "attributes",
DROP COLUMN "files",
DROP COLUMN "price",
DROP COLUMN "stock";

-- CreateTable
CREATE TABLE "productVariant" (
    "id" TEXT NOT NULL,
    "cursor" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "price" DECIMAL(10,2) NOT NULL,
    "attributes" JSONB,
    "files" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "productVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "productVariant_sku_key" ON "productVariant"("sku");

-- CreateIndex
CREATE INDEX "productVariant_productId_idx" ON "productVariant"("productId");

-- CreateIndex
CREATE INDEX "cartItem_productVariantId_idx" ON "cartItem"("productVariantId");

-- CreateIndex
CREATE INDEX "orderItem_productVariantId_idx" ON "orderItem"("productVariantId");

-- CreateIndex
CREATE INDEX "product_name_trgm_idx" ON "product" USING GIN ("name" gin_trgm_ops);

-- AddForeignKey
ALTER TABLE "productVariant" ADD CONSTRAINT "productVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartItem" ADD CONSTRAINT "cartItem_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "productVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderItem" ADD CONSTRAINT "orderItem_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "productVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

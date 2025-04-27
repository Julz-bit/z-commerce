/*
  Warnings:

  - Added the required column `categoriesFlat` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product" ADD COLUMN     "categoriesFlat" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "product_categories_flat_trgm_idx" ON "product" USING GIN ("categoriesFlat" gin_trgm_ops);

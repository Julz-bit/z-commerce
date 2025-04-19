-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "cursor" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "addresses" JSONB,
    "lastAccess" TIMESTAMP(3),
    "isVerified" BOOLEAN DEFAULT false,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store" (
    "id" TEXT NOT NULL,
    "cursor" SERIAL NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "rating" DECIMAL(3,2),
    "isVerified" BOOLEAN DEFAULT false,
    "contactNumber" TEXT,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "cursor" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "cursor" SERIAL NOT NULL,
    "storeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "categories" JSONB,
    "attributes" JSONB,
    "files" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cartItem" (
    "id" TEXT NOT NULL,
    "cursor" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" TEXT NOT NULL,
    "cursor" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "shippingInfo" JSONB NOT NULL,
    "paymentInfo" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orderItem" (
    "id" TEXT NOT NULL,
    "cursor" SERIAL NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "orderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" TEXT NOT NULL,
    "cursor" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount" (
    "id" TEXT NOT NULL,
    "cursor" SERIAL NOT NULL,
    "storeId" TEXT NOT NULL,
    "name" TEXT,
    "type" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "minorderValue" DECIMAL(10,2),
    "maxdiscountValue" DECIMAL(10,2),
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productDiscount" (
    "id" TEXT NOT NULL,
    "cursor" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,

    CONSTRAINT "productDiscount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashSale" (
    "id" TEXT NOT NULL,
    "cursor" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "flashPrice" DECIMAL(10,2) NOT NULL,
    "stockLimit" INTEGER,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flashSale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voucher" (
    "id" TEXT NOT NULL,
    "cursor" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "storeId" TEXT,
    "type" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "minorderValue" DECIMAL(10,2),
    "maxdiscountValue" DECIMAL(10,2),
    "totalUsageLimit" INTEGER,
    "peruserLimit" INTEGER,
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "voucher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voucherUsage" (
    "id" TEXT NOT NULL,
    "cursor" SERIAL NOT NULL,
    "voucherId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "voucherUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_cursor_idx" ON "user"("cursor");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- CreateIndex
CREATE INDEX "store_cursor_idx" ON "store"("cursor");

-- CreateIndex
CREATE INDEX "store_ownerId_idx" ON "store"("ownerId");

-- CreateIndex
CREATE INDEX "store_name_idx" ON "store"("name");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE INDEX "category_cursor_idx" ON "category"("cursor");

-- CreateIndex
CREATE INDEX "category_parentId_idx" ON "category"("parentId");

-- CreateIndex
CREATE INDEX "product_cursor_idx" ON "product"("cursor");

-- CreateIndex
CREATE INDEX "product_storeId_idx" ON "product"("storeId");

-- CreateIndex
CREATE INDEX "product_name_idx" ON "product"("name");

-- CreateIndex
CREATE INDEX "product_price_idx" ON "product"("price");

-- CreateIndex
CREATE INDEX "product_categories_gin_idx" ON "product" USING GIN ("categories");

-- CreateIndex
CREATE INDEX "cartItem_cursor_idx" ON "cartItem"("cursor");

-- CreateIndex
CREATE INDEX "cartItem_userId_idx" ON "cartItem"("userId");

-- CreateIndex
CREATE INDEX "cartItem_storeId_idx" ON "cartItem"("storeId");

-- CreateIndex
CREATE INDEX "cartItem_productId_idx" ON "cartItem"("productId");

-- CreateIndex
CREATE INDEX "cartItem_status_idx" ON "cartItem"("status");

-- CreateIndex
CREATE INDEX "order_cursor_idx" ON "order"("cursor");

-- CreateIndex
CREATE INDEX "order_userId_idx" ON "order"("userId");

-- CreateIndex
CREATE INDEX "order_storeId_idx" ON "order"("storeId");

-- CreateIndex
CREATE INDEX "order_status_idx" ON "order"("status");

-- CreateIndex
CREATE INDEX "orderItem_cursor_idx" ON "orderItem"("cursor");

-- CreateIndex
CREATE INDEX "orderItem_orderId_idx" ON "orderItem"("orderId");

-- CreateIndex
CREATE INDEX "orderItem_productId_idx" ON "orderItem"("productId");

-- CreateIndex
CREATE INDEX "review_cursor_idx" ON "review"("cursor");

-- CreateIndex
CREATE INDEX "review_userId_idx" ON "review"("userId");

-- CreateIndex
CREATE INDEX "review_productId_idx" ON "review"("productId");

-- CreateIndex
CREATE INDEX "discount_cursor_idx" ON "discount"("cursor");

-- CreateIndex
CREATE INDEX "discount_storeId_idx" ON "discount"("storeId");

-- CreateIndex
CREATE INDEX "discount_startAt_idx" ON "discount"("startAt");

-- CreateIndex
CREATE INDEX "discount_endAt_idx" ON "discount"("endAt");

-- CreateIndex
CREATE INDEX "productDiscount_cursor_idx" ON "productDiscount"("cursor");

-- CreateIndex
CREATE INDEX "productDiscount_productId_idx" ON "productDiscount"("productId");

-- CreateIndex
CREATE INDEX "productDiscount_discountId_idx" ON "productDiscount"("discountId");

-- CreateIndex
CREATE UNIQUE INDEX "productDiscount_productId_discountId_key" ON "productDiscount"("productId", "discountId");

-- CreateIndex
CREATE INDEX "flashSale_cursor_idx" ON "flashSale"("cursor");

-- CreateIndex
CREATE INDEX "flashSale_productId_idx" ON "flashSale"("productId");

-- CreateIndex
CREATE INDEX "flashSale_startAt_idx" ON "flashSale"("startAt");

-- CreateIndex
CREATE INDEX "flashSale_endAt_idx" ON "flashSale"("endAt");

-- CreateIndex
CREATE UNIQUE INDEX "voucher_code_key" ON "voucher"("code");

-- CreateIndex
CREATE INDEX "voucher_cursor_idx" ON "voucher"("cursor");

-- CreateIndex
CREATE INDEX "voucher_storeId_idx" ON "voucher"("storeId");

-- CreateIndex
CREATE INDEX "voucher_startAt_idx" ON "voucher"("startAt");

-- CreateIndex
CREATE INDEX "voucher_endAt_idx" ON "voucher"("endAt");

-- CreateIndex
CREATE INDEX "voucher_type_idx" ON "voucher"("type");

-- CreateIndex
CREATE INDEX "voucherUsage_cursor_idx" ON "voucherUsage"("cursor");

-- CreateIndex
CREATE INDEX "voucherUsage_voucherId_idx" ON "voucherUsage"("voucherId");

-- CreateIndex
CREATE INDEX "voucherUsage_userId_idx" ON "voucherUsage"("userId");

-- CreateIndex
CREATE INDEX "voucherUsage_orderId_idx" ON "voucherUsage"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "voucherUsage_voucherId_userId_orderId_key" ON "voucherUsage"("voucherId", "userId", "orderId");

-- AddForeignKey
ALTER TABLE "store" ADD CONSTRAINT "store_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartItem" ADD CONSTRAINT "cartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartItem" ADD CONSTRAINT "cartItem_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartItem" ADD CONSTRAINT "cartItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderItem" ADD CONSTRAINT "orderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderItem" ADD CONSTRAINT "orderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount" ADD CONSTRAINT "discount_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productDiscount" ADD CONSTRAINT "productDiscount_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "discount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productDiscount" ADD CONSTRAINT "productDiscount_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashSale" ADD CONSTRAINT "flashSale_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucher" ADD CONSTRAINT "voucher_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucherUsage" ADD CONSTRAINT "voucherUsage_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucherUsage" ADD CONSTRAINT "voucherUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucherUsage" ADD CONSTRAINT "voucherUsage_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "voucher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

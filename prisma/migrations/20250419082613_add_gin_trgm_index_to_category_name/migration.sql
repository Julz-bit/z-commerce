-- CreateIndex
CREATE INDEX "category_name_trgm_idx" ON "category" USING GIN ("name" gin_trgm_ops);

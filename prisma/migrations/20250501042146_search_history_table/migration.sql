-- CreateTable
CREATE TABLE "searchHistory" (
    "id" TEXT NOT NULL,
    "cursor" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "searchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "searchHistory_userId_keyword_idx" ON "searchHistory"("userId", "keyword");

-- AddForeignKey
ALTER TABLE "searchHistory" ADD CONSTRAINT "searchHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

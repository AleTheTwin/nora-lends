-- CreateTable
CREATE TABLE "token" (
    "id" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "token_id_key" ON "token"("id");

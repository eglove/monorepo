-- CreateTable
CREATE TABLE "JWKS" (
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "JWKS_publicKey_key" ON "JWKS"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "JWKS_privateKey_key" ON "JWKS"("privateKey");

/*
  Warnings:

  - The required column `id` was added to the `JWKS` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JWKS" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL
);
INSERT INTO "new_JWKS" ("privateKey", "publicKey") SELECT "privateKey", "publicKey" FROM "JWKS";
DROP TABLE "JWKS";
ALTER TABLE "new_JWKS" RENAME TO "JWKS";
CREATE UNIQUE INDEX "JWKS_publicKey_key" ON "JWKS"("publicKey");
CREATE UNIQUE INDEX "JWKS_privateKey_key" ON "JWKS"("privateKey");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

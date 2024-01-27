-- CreateEnum
CREATE TYPE "CredentialDeviceType" AS ENUM ('singleDevice', 'multiDevice');

-- CreateEnum
CREATE TYPE "AuthenticatorTransport" AS ENUM ('usb', 'ble', 'nfc', 'internal');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "currentChallenge" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Authenticator" (
    "id" TEXT NOT NULL,
    "credentialId" TEXT NOT NULL,
    "credentialPublicKey" BYTEA NOT NULL,
    "counter" BIGINT NOT NULL,
    "credentialDeviceType" "CredentialDeviceType" NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "transports" "AuthenticatorTransport"[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "Authenticator_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Authenticator" ADD CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

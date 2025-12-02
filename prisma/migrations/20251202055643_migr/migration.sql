/*
  Warnings:

  - You are about to drop the `BoxClientInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "BoxClientInfo";

-- CreateTable
CREATE TABLE "box_client_info" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "hostname" TEXT,
    "city" TEXT,
    "region" TEXT,
    "country" TEXT,
    "loc" TEXT,
    "org" TEXT,
    "timezone" TEXT,
    "readme" TEXT,
    "macAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "box_client_info_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "box_client_info_macAddress_key" ON "box_client_info"("macAddress");

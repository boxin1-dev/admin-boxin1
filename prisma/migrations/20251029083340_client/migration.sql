-- CreateTable
CREATE TABLE "text_entry" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "lang" TEXT NOT NULL DEFAULT 'fr',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "text_entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoxClientInfo" (
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
    "macAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoxClientInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "text_entry_key_key" ON "text_entry"("key");

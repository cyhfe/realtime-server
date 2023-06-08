/*
  Warnings:

  - You are about to drop the `Convarsation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `convarsationId` on the `AiMessage` table. All the data in the column will be lost.
  - Added the required column `conversationId` to the `AiMessage` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Convarsation";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AiMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    CONSTRAINT "AiMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AiMessage" ("content", "createdAt", "id", "role") SELECT "content", "createdAt", "id", "role" FROM "AiMessage";
DROP TABLE "AiMessage";
ALTER TABLE "new_AiMessage" RENAME TO "AiMessage";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

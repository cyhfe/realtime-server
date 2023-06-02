/*
  Warnings:

  - You are about to drop the `PrivateRoom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "PrivateRoom_userId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PrivateRoom";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PrivateMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    CONSTRAINT "PrivateMessage_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PrivateMessage_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PrivateMessage" ("content", "createdAt", "fromUserId", "id", "toUserId") SELECT "content", "createdAt", "fromUserId", "id", "toUserId" FROM "PrivateMessage";
DROP TABLE "PrivateMessage";
ALTER TABLE "new_PrivateMessage" RENAME TO "PrivateMessage";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

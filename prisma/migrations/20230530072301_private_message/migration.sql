/*
  Warnings:

  - You are about to drop the column `toRoomId` on the `PrivateMessage` table. All the data in the column will be lost.
  - Added the required column `toUserId` to the `PrivateMessage` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PrivateMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    CONSTRAINT "PrivateMessage_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PrivateMessage_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "PrivateRoom" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PrivateMessage" ("content", "createdAt", "fromUserId", "id") SELECT "content", "createdAt", "fromUserId", "id" FROM "PrivateMessage";
DROP TABLE "PrivateMessage";
ALTER TABLE "new_PrivateMessage" RENAME TO "PrivateMessage";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

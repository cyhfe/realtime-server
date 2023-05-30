/*
  Warnings:

  - Added the required column `content` to the `PrivateMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `ChanelMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Chanel` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PrivateMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromUserId" TEXT NOT NULL,
    "toRoomId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    CONSTRAINT "PrivateMessage_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PrivateMessage_toRoomId_fkey" FOREIGN KEY ("toRoomId") REFERENCES "PrivateRoom" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PrivateMessage" ("createdAt", "fromUserId", "id", "toRoomId") SELECT "createdAt", "fromUserId", "id", "toRoomId" FROM "PrivateMessage";
DROP TABLE "PrivateMessage";
ALTER TABLE "new_PrivateMessage" RENAME TO "PrivateMessage";
CREATE TABLE "new_ChanelMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromUserId" TEXT NOT NULL,
    "toChanelId" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "content" TEXT NOT NULL,
    CONSTRAINT "ChanelMessage_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChanelMessage_toChanelId_fkey" FOREIGN KEY ("toChanelId") REFERENCES "Chanel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ChanelMessage" ("createdAt", "fromUserId", "id", "read", "toChanelId") SELECT "createdAt", "fromUserId", "id", "read", "toChanelId" FROM "ChanelMessage";
DROP TABLE "ChanelMessage";
ALTER TABLE "new_ChanelMessage" RENAME TO "ChanelMessage";
CREATE TABLE "new_Chanel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Chanel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Chanel" ("createdAt", "id", "userId") SELECT "createdAt", "id", "userId" FROM "Chanel";
DROP TABLE "Chanel";
ALTER TABLE "new_Chanel" RENAME TO "Chanel";
CREATE UNIQUE INDEX "Chanel_name_key" ON "Chanel"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

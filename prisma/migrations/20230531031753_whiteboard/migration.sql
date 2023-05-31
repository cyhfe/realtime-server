/*
  Warnings:

  - You are about to drop the `Chanel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChanelMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Chanel_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Chanel";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ChanelMessage";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ChannelMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromUserId" TEXT NOT NULL,
    "toChannelId" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "content" TEXT NOT NULL,
    CONSTRAINT "ChannelMessage_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChannelMessage_toChannelId_fkey" FOREIGN KEY ("toChannelId") REFERENCES "Channel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Channel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChannelBoard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "channelId" TEXT NOT NULL,
    "history" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ChannelBoard_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChannelStroke" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "channelBoardId" TEXT NOT NULL,
    CONSTRAINT "ChannelStroke_channelBoardId_fkey" FOREIGN KEY ("channelBoardId") REFERENCES "ChannelBoard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChannelPoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "strokeId" TEXT NOT NULL,
    CONSTRAINT "ChannelPoint_strokeId_fkey" FOREIGN KEY ("strokeId") REFERENCES "ChannelStroke" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PrivateBoard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "privateRoomId" TEXT NOT NULL,
    "history" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "PrivateBoard_privateRoomId_fkey" FOREIGN KEY ("privateRoomId") REFERENCES "PrivateRoom" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PrivateStroke" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "privateBoardId" TEXT NOT NULL,
    CONSTRAINT "PrivateStroke_privateBoardId_fkey" FOREIGN KEY ("privateBoardId") REFERENCES "PrivateBoard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PrivatePoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "strokeId" TEXT NOT NULL,
    CONSTRAINT "PrivatePoint_strokeId_fkey" FOREIGN KEY ("strokeId") REFERENCES "PrivateStroke" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PrivateMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    CONSTRAINT "PrivateMessage_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PrivateMessage_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "PrivateRoom" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PrivateMessage" ("content", "createdAt", "fromUserId", "id", "toUserId") SELECT "content", "createdAt", "fromUserId", "id", "toUserId" FROM "PrivateMessage";
DROP TABLE "PrivateMessage";
ALTER TABLE "new_PrivateMessage" RENAME TO "PrivateMessage";
CREATE TABLE "new_PrivateRoom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "PrivateRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PrivateRoom" ("createdAt", "id", "userId") SELECT "createdAt", "id", "userId" FROM "PrivateRoom";
DROP TABLE "PrivateRoom";
ALTER TABLE "new_PrivateRoom" RENAME TO "PrivateRoom";
CREATE UNIQUE INDEX "PrivateRoom_userId_key" ON "PrivateRoom"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Channel_name_key" ON "Channel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelBoard_channelId_key" ON "ChannelBoard"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateBoard_privateRoomId_key" ON "PrivateBoard"("privateRoomId");

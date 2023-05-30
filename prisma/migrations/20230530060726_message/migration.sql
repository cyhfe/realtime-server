-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChanelMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromUserId" TEXT NOT NULL,
    "toChanelId" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ChanelMessage_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChanelMessage_toChanelId_fkey" FOREIGN KEY ("toChanelId") REFERENCES "Chanel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ChanelMessage" ("createdAt", "fromUserId", "id", "toChanelId") SELECT "createdAt", "fromUserId", "id", "toChanelId" FROM "ChanelMessage";
DROP TABLE "ChanelMessage";
ALTER TABLE "new_ChanelMessage" RENAME TO "ChanelMessage";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

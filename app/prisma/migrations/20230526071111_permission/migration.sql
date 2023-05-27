/*
  Warnings:

  - You are about to drop the `TodoList` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TodoTask` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "TodoList_userId_key";

-- DropIndex
DROP INDEX "TodoList_title_key";

-- DropIndex
DROP INDEX "TodoTask_userId_key";

-- DropIndex
DROP INDEX "TodoTask_todoListId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TodoList";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TodoTask";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_User" ("createdAt", "id", "password", "username") SELECT "createdAt", "id", "password", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

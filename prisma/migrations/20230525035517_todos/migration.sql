/*
  Warnings:

  - You are about to drop the `List` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- DropIndex
DROP INDEX "List_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "List";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Task";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "TodoList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "TodoList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TodoTask" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "todoListId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "TodoTask_todoListId_fkey" FOREIGN KEY ("todoListId") REFERENCES "TodoList" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TodoTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_User" ("createdAt", "id", "password", "username") SELECT "createdAt", "id", "password", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "TodoList_title_key" ON "TodoList"("title");

-- CreateIndex
CREATE UNIQUE INDEX "TodoList_userId_key" ON "TodoList"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TodoTask_todoListId_key" ON "TodoTask"("todoListId");

-- CreateIndex
CREATE UNIQUE INDEX "TodoTask_userId_key" ON "TodoTask"("userId");

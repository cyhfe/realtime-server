/*
  Warnings:

  - You are about to drop the `ChannelBoard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChannelPoint` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChannelStroke` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PrivateBoard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PrivatePoint` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PrivateStroke` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ChannelBoard";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ChannelPoint";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ChannelStroke";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PrivateBoard";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PrivatePoint";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PrivateStroke";
PRAGMA foreign_keys=on;

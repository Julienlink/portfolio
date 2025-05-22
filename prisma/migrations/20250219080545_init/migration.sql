/*
  Warnings:

  - Added the required column `isHighlight` to the `Projects` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Projects" (
    "projectId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectName" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "isHighlight" BOOLEAN NOT NULL
);
INSERT INTO "new_Projects" ("desc", "imagePath", "projectId", "projectName") SELECT "desc", "imagePath", "projectId", "projectName" FROM "Projects";
DROP TABLE "Projects";
ALTER TABLE "new_Projects" RENAME TO "Projects";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

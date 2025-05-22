-- CreateTable
CREATE TABLE "Projects" (
    "projectId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectName" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "desc" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "appliedSkills" (
    "projectId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,

    PRIMARY KEY ("projectId", "skillId"),
    CONSTRAINT "appliedSkills_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects" ("projectId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "appliedSkills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skills" ("skillId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Skills" (
    "skillId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "skillName" TEXT NOT NULL
);

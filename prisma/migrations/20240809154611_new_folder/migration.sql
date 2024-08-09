/*
  Warnings:

  - You are about to drop the `UserProjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserProjects" DROP CONSTRAINT "UserProjects_projectId_fkey";

-- DropForeignKey
ALTER TABLE "UserProjects" DROP CONSTRAINT "UserProjects_userId_fkey";

-- DropTable
DROP TABLE "UserProjects";

/*
  Warnings:

  - You are about to drop the `TemplateFile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TemplateFile" DROP CONSTRAINT "TemplateFile_playgroundId_fkey";

-- DropTable
DROP TABLE "TemplateFile";

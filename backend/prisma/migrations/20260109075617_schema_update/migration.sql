/*
  Warnings:

  - A unique constraint covering the columns `[playgroundId]` on the table `TemplateFile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TemplateFile_playgroundId_key" ON "TemplateFile"("playgroundId");

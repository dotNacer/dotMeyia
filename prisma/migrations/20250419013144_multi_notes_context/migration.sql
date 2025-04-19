/*
  Warnings:

  - You are about to drop the column `contextId` on the `note` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "note" DROP CONSTRAINT "note_contextId_fkey";

-- AlterTable
ALTER TABLE "note" DROP COLUMN "contextId";

-- CreateTable
CREATE TABLE "_AIContextToNote" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AIContextToNote_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AIContextToNote_B_index" ON "_AIContextToNote"("B");

-- AddForeignKey
ALTER TABLE "_AIContextToNote" ADD CONSTRAINT "_AIContextToNote_A_fkey" FOREIGN KEY ("A") REFERENCES "context"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AIContextToNote" ADD CONSTRAINT "_AIContextToNote_B_fkey" FOREIGN KEY ("B") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - Added the required column `title` to the `context` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- First add the column as nullable
ALTER TABLE "context" ADD COLUMN "title" TEXT;

-- Update existing records with a default value
UPDATE "context" SET "title" = 'Untitled Context' WHERE "title" IS NULL;

-- Make the column required
ALTER TABLE "context" ALTER COLUMN "title" SET NOT NULL;

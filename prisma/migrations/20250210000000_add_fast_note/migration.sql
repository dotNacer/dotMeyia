-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to note table (768 dimensions for Gemini text-embedding-004)
ALTER TABLE "note" ADD COLUMN IF NOT EXISTS "embedding" vector(768);

-- Create fast_note table
CREATE TABLE "fast_note" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fast_note_pkey" PRIMARY KEY ("id")
);

-- CreateIndex (for FK performance)
CREATE INDEX IF NOT EXISTS "fast_note_noteId_idx" ON "fast_note"("noteId");
CREATE INDEX IF NOT EXISTS "fast_note_userId_idx" ON "fast_note"("userId");

-- Add FK constraints
ALTER TABLE "fast_note" ADD CONSTRAINT "fast_note_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "fast_note" ADD CONSTRAINT "fast_note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Note: Pour de meilleures perfs sur >1000 notes, ajouter un index ivfflat ou hnsw
-- après avoir des données : CREATE INDEX note_embedding_idx ON note USING hnsw (embedding vector_cosine_ops);

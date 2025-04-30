-- CreateTable
CREATE TABLE "_CategoryToNote" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToNote_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryToNote_B_index" ON "_CategoryToNote"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToNote" ADD CONSTRAINT "_CategoryToNote_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToNote" ADD CONSTRAINT "_CategoryToNote_B_fkey" FOREIGN KEY ("B") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

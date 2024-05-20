-- AddForeignKey
ALTER TABLE "Bids" ADD CONSTRAINT "Bids_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

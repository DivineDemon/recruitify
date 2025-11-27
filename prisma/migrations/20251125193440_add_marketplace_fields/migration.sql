-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "category" TEXT,
ADD COLUMN     "isPreDesigned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "previewImageUrl" TEXT,
ADD COLUMN     "sourceTemplateId" TEXT,
ADD COLUMN     "tags" JSONB;

-- CreateIndex
CREATE INDEX "Template_isPreDesigned_idx" ON "Template"("isPreDesigned");

-- CreateIndex
CREATE INDEX "Template_isPreDesigned_category_idx" ON "Template"("isPreDesigned", "category");

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_sourceTemplateId_fkey" FOREIGN KEY ("sourceTemplateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameId" TEXT NOT NULL,
    "detailEn" TEXT NOT NULL DEFAULT '',
    "detailId" TEXT NOT NULL DEFAULT '',
    "mediaId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

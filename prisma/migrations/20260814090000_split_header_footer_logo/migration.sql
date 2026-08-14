-- AddColumn
ALTER TABLE "SiteConfig" ADD COLUMN "headerLogoId" TEXT;
ALTER TABLE "SiteConfig" ADD COLUMN "footerLogoId" TEXT;

-- Carry the existing single logo forward into both slots so nothing
-- disappears from the live site until the admin uploads distinct ones.
UPDATE "SiteConfig" SET "headerLogoId" = "logoId", "footerLogoId" = "logoId";

-- DropForeignKey
ALTER TABLE "SiteConfig" DROP CONSTRAINT "SiteConfig_logoId_fkey";

-- DropColumn
ALTER TABLE "SiteConfig" DROP COLUMN "logoId";

-- AddForeignKey
ALTER TABLE "SiteConfig" ADD CONSTRAINT "SiteConfig_headerLogoId_fkey" FOREIGN KEY ("headerLogoId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SiteConfig" ADD CONSTRAINT "SiteConfig_footerLogoId_fkey" FOREIGN KEY ("footerLogoId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

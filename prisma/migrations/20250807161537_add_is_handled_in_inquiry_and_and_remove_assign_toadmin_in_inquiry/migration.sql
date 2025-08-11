/*
  Warnings:

  - You are about to drop the column `assignedToAdminId` on the `HardwareInquiry` table. All the data in the column will be lost.
  - You are about to drop the column `assignedToAdminId` on the `ServiceInquiry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."HardwareInquiry" DROP COLUMN "assignedToAdminId",
ADD COLUMN     "handledById" TEXT,
ADD COLUMN     "isHandled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Plan" ADD COLUMN     "handledById" TEXT,
ADD COLUMN     "isHandled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."ServiceInquiry" DROP COLUMN "assignedToAdminId",
ADD COLUMN     "handledById" TEXT,
ADD COLUMN     "isHandled" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "public"."HardwareInquiry" ADD CONSTRAINT "HardwareInquiry_handledById_fkey" FOREIGN KEY ("handledById") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceInquiry" ADD CONSTRAINT "ServiceInquiry_handledById_fkey" FOREIGN KEY ("handledById") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Plan" ADD CONSTRAINT "Plan_handledById_fkey" FOREIGN KEY ("handledById") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

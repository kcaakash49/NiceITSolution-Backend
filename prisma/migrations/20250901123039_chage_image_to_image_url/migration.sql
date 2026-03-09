/*
  Warnings:

  - Added the required column `imageUrl` to the `HardwareCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addedById` to the `HardwareProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addedById` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addedById` to the `ServiceProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."HardwareCategory" ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."HardwareProduct" ADD COLUMN     "addedById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Plan" ADD COLUMN     "addedById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."ServiceProduct" ADD COLUMN     "addedById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."HardwareProduct" ADD CONSTRAINT "HardwareProduct_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "public"."AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Plan" ADD CONSTRAINT "Plan_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "public"."AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceProduct" ADD CONSTRAINT "ServiceProduct_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "public"."AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

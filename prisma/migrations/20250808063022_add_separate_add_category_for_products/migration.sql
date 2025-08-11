/*
  Warnings:

  - You are about to drop the column `category` on the `HardwareProduct` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `HardwareProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."HardwareProduct" DROP COLUMN "category",
ADD COLUMN     "categoryId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."HardwareCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HardwareCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HardwareCategory_name_key" ON "public"."HardwareCategory"("name");

-- AddForeignKey
ALTER TABLE "public"."HardwareProduct" ADD CONSTRAINT "HardwareProduct_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."HardwareCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

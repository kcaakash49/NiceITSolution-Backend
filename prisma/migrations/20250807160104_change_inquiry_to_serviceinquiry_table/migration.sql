/*
  Warnings:

  - You are about to drop the `Inquiry` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Inquiry" DROP CONSTRAINT "Inquiry_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Inquiry" DROP CONSTRAINT "Inquiry_selectedPlanId_fkey";

-- DropTable
DROP TABLE "public"."Inquiry";

-- CreateTable
CREATE TABLE "public"."ServiceInquiry" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "productId" TEXT NOT NULL,
    "selectedPlanId" TEXT,
    "message" TEXT NOT NULL,
    "status" "public"."InquiryStatus" NOT NULL DEFAULT 'new',
    "assignedToAdminId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceInquiry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ServiceInquiry" ADD CONSTRAINT "ServiceInquiry_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."ServiceProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceInquiry" ADD CONSTRAINT "ServiceInquiry_selectedPlanId_fkey" FOREIGN KEY ("selectedPlanId") REFERENCES "public"."Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

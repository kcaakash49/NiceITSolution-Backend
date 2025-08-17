/*
  Warnings:

  - You are about to drop the column `handledById` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `isHandled` on the `Plan` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Plan" DROP CONSTRAINT "Plan_handledById_fkey";

-- AlterTable
ALTER TABLE "public"."Plan" DROP COLUMN "handledById",
DROP COLUMN "isHandled";

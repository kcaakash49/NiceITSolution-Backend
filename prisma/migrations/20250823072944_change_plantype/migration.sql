/*
  Warnings:

  - The values [development,hosting,bundle] on the enum `PlanType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."PlanType_new" AS ENUM ('starter', 'professional', 'premium', 'enterprise');
ALTER TABLE "public"."Plan" ALTER COLUMN "type" TYPE "public"."PlanType_new" USING ("type"::text::"public"."PlanType_new");
ALTER TYPE "public"."PlanType" RENAME TO "PlanType_old";
ALTER TYPE "public"."PlanType_new" RENAME TO "PlanType";
DROP TYPE "public"."PlanType_old";
COMMIT;

-- CreateEnum
CREATE TYPE "public"."InquiryStatus" AS ENUM ('new', 'contacted', 'qualified', 'closed', 'rejected');

-- CreateEnum
CREATE TYPE "public"."PlanType" AS ENUM ('starter', 'professional', 'premium', 'enterprise');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'INVENTORY_MANAGER', 'SALES', 'ACCOUNTANT', 'VIEWER');

-- CreateEnum
CREATE TYPE "public"."ProductStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'DISCONTINUED');

-- CreateEnum
CREATE TYPE "public"."PurchaseStatus" AS ENUM ('DRAFT', 'ORDERED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."InvoiceStatus" AS ENUM ('DRAFT', 'FINALIZED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'PARTIAL', 'PAID', 'OVERDUE');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CASH', 'ONLINE', 'CHEQUE');

-- CreateEnum
CREATE TYPE "public"."MovementType" AS ENUM ('PURCHASE_IN', 'SALE_OUT', 'TRANSFER_IN', 'TRANSFER_OUT', 'RETURN_IN', 'WARRANTY_OUT', 'DAMAGE_OUT', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT');

-- CreateEnum
CREATE TYPE "public"."WarrantyStatus" AS ENUM ('SUBMITTED', 'CHECKING', 'APPROVED', 'SENT_TO_SUPPLIER', 'REPLACED', 'REJECTED', 'RESOLVED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HardwareInquiry" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "status" "public"."InquiryStatus" NOT NULL DEFAULT 'new',
    "handledById" TEXT,
    "isHandled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HardwareInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HardwareProduct" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "stock" INTEGER,
    "length" INTEGER,
    "addedById" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HardwareProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HardwareCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isLengthNeeded" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HardwareCategory_pkey" PRIMARY KEY ("id")
);

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
    "handledById" TEXT,
    "isHandled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Plan" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."PlanType" NOT NULL,
    "priceMonthly" DOUBLE PRECISION,
    "priceOneTime" DOUBLE PRECISION,
    "features" TEXT[],
    "addedById" TEXT NOT NULL,
    "contractDuration" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ServiceProduct" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "addedById" TEXT NOT NULL,

    CONSTRAINT "ServiceProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Warehouse" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "categoryId" TEXT NOT NULL,
    "brand" TEXT,
    "status" "public"."ProductStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductBatch" (
    "id" TEXT NOT NULL,
    "batchCode" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "quantityIn" INTEGER NOT NULL,
    "quantityOut" INTEGER NOT NULL DEFAULT 0,
    "damagedQty" INTEGER NOT NULL DEFAULT 0,
    "purchasePrice" DECIMAL(18,2) NOT NULL,
    "supplierId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InventoryBalance" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "available" INTEGER NOT NULL,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    "damaged" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StockMovement" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "batchId" TEXT,
    "warehouseId" TEXT NOT NULL,
    "type" "public"."MovementType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Purchase" (
    "id" TEXT NOT NULL,
    "purchaseCode" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "status" "public"."PurchaseStatus" NOT NULL DEFAULT 'DRAFT',
    "totalAmount" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PurchaseItem" (
    "id" TEXT NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(18,2) NOT NULL,

    CONSTRAINT "PurchaseItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Sale" (
    "id" TEXT NOT NULL,
    "invoiceNo" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "status" "public"."InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "totalAmount" DECIMAL(18,2) NOT NULL,
    "paidAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "dueAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "vatEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalizedAt" TIMESTAMP(3),

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SaleItem" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(18,2) NOT NULL,
    "vatType" TEXT,
    "vatAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,

    CONSTRAINT "SaleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SaleItemBatch" (
    "id" TEXT NOT NULL,
    "saleItemId" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "SaleItemBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "method" "public"."PaymentMethod" NOT NULL,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "receivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transfer" (
    "id" TEXT NOT NULL,
    "fromWarehouseId" TEXT NOT NULL,
    "toWarehouseId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Expense" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DailySnapshot" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalSales" DECIMAL(18,2) NOT NULL,
    "totalPaid" DECIMAL(18,2) NOT NULL,
    "totalDue" DECIMAL(18,2) NOT NULL,
    "totalExpense" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailySnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."File" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT,
    "type" TEXT,
    "size" INTEGER,
    "entityType" TEXT,
    "entityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "HardwareCategory_name_key" ON "public"."HardwareCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "public"."Product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "ProductBatch_batchCode_key" ON "public"."ProductBatch"("batchCode");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryBalance_productId_warehouseId_key" ON "public"."InventoryBalance"("productId", "warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_purchaseCode_key" ON "public"."Purchase"("purchaseCode");

-- CreateIndex
CREATE UNIQUE INDEX "Sale_invoiceNo_key" ON "public"."Sale"("invoiceNo");

-- CreateIndex
CREATE UNIQUE INDEX "DailySnapshot_date_key" ON "public"."DailySnapshot"("date");

-- CreateIndex
CREATE INDEX "File_entityType_entityId_idx" ON "public"."File"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "public"."Category"("slug");

-- AddForeignKey
ALTER TABLE "public"."HardwareInquiry" ADD CONSTRAINT "HardwareInquiry_handledById_fkey" FOREIGN KEY ("handledById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HardwareInquiry" ADD CONSTRAINT "HardwareInquiry_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."HardwareProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HardwareProduct" ADD CONSTRAINT "HardwareProduct_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."HardwareCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HardwareProduct" ADD CONSTRAINT "HardwareProduct_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceInquiry" ADD CONSTRAINT "ServiceInquiry_handledById_fkey" FOREIGN KEY ("handledById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceInquiry" ADD CONSTRAINT "ServiceInquiry_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."ServiceProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceInquiry" ADD CONSTRAINT "ServiceInquiry_selectedPlanId_fkey" FOREIGN KEY ("selectedPlanId") REFERENCES "public"."Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Plan" ADD CONSTRAINT "Plan_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Plan" ADD CONSTRAINT "Plan_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."ServiceProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceProduct" ADD CONSTRAINT "ServiceProduct_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductBatch" ADD CONSTRAINT "ProductBatch_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductBatch" ADD CONSTRAINT "ProductBatch_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "public"."Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockMovement" ADD CONSTRAINT "StockMovement_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "public"."ProductBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PurchaseItem" ADD CONSTRAINT "PurchaseItem_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "public"."Purchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SaleItem" ADD CONSTRAINT "SaleItem_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "public"."Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SaleItemBatch" ADD CONSTRAINT "SaleItemBatch_saleItemId_fkey" FOREIGN KEY ("saleItemId") REFERENCES "public"."SaleItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SaleItemBatch" ADD CONSTRAINT "SaleItemBatch_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "public"."ProductBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "public"."Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

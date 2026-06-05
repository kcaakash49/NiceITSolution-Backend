import { UploadedFile } from "../../types/uploadFileType.js";
import { ProductType } from "./product.type.js";
import prisma from "../../db/db.js";
import { AppError } from "../../utils/error.js";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const IMAGE_DIR = "/var/www/nit/images/products";

export async function createProductFunction({
  body,
  file,
  userId,
}: {
  body: ProductType;
  file: UploadedFile;
  userId: string;
}) {
  const finalBody = {
    name: body.name,
    sku: body.sku,
    categoryId: body.categoryId,
    brand: body.brand || null,
  };

  let imageUrl = "";
  try {
    const existing = await prisma.product.findUnique({
      where: { sku: finalBody.sku },
    });
    if (existing) {
      throw new AppError(409, "Product with this SKU already exists");
    }
    if (file) {
      const imageFile = file;
      const filename = Date.now() + "-" + imageFile.originalname;
      const outputFormat = "webp";
      const filePath = path.join(
        IMAGE_DIR,
        filename.replace(path.extname(filename), `.${outputFormat}`),
      );

      const optimizedBuffer = await sharp(imageFile.buffer)
        .resize(900)
        .toFormat(outputFormat, { quality: 85 })
        .toBuffer();

      await fs.promises.writeFile(filePath, optimizedBuffer);

      imageUrl = `/images/products/${path.basename(filePath)}`;
    }
    if (!imageUrl) {
      throw new AppError(400, "Image is required for product");
    }

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          ...finalBody,
        },
      });
      await tx.file.create({
        data: {
          url: imageUrl,
          name: product.name,
          type: file.mimetype,
          entityId: product.id,
          entityType: "Product",
        },
      });
      await tx.auditLog.create({
        data: {
          userId,
          action: "CREATE",
          entity: "Product",
          entityId: product.id,
        },
      });

      return product;
    });

    return result;
  } catch (error) {
    if (imageUrl) {
      const filePath = path.join(IMAGE_DIR, path.basename(imageUrl));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(500, "Failed to create product");
  }
}

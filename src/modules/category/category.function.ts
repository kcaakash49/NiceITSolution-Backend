import { UploadedFile } from "../../types/uploadFileType.js";
import prisma from "../../db/db.js";
import { AppError } from "../../utils/error.js";
import fs from "fs";
import path from "path";
import sharp from "sharp";

type CategoryBody = {
  name: string;
  parentId?: string;
  slug: string;
};

type Upload = UploadedFile | null;

const IMAGE_DIR = "/var/www/nit/images/categories";

export async function addCategory({
  body,
  file,
}: {
  body: CategoryBody;
  file: Upload;
}) {
  const finalBody = {
    name: body.name,
    slug: body.slug,
    parentId: body.parentId || null,
  };

  let imageUrl = "";
  try {
    const existing = await prisma.category.findUnique({
      where: { slug: finalBody.slug },
    });
    if (existing) {
      throw new AppError(409, "Category with this slug already exists");
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
        .toFormat(outputFormat, { quality: 100 })
        .toBuffer();

      await fs.promises.writeFile(filePath, optimizedBuffer);

      imageUrl = `/images/categories/${path.basename(filePath)}`;
    }
    if (!imageUrl) {
      throw new AppError(400, "Image is required for category");
    }

    const category = await prisma.category.create({
      data: {
        ...finalBody,
        image: imageUrl,
      },
    });

    return category;
  } catch (error) {
    console.error("Error creating category:", error);
    if (imageUrl) {
      const filePath = path.join(IMAGE_DIR, path.basename(imageUrl));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(500, "Failed to create category");
  }
}

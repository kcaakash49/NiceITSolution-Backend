import { ProductStatus } from "@prisma/client";

export interface ProductType {
    name: string;
    sku:string;
    categoryId:string;
    brand?:string;
}
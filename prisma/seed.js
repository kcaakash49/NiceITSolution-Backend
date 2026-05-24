// prisma/seed.js

import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding admin user...");
    // Change these values as needed
    const adminEmail = "kcaakash4910@gmail.com";
    const adminPassword = "A@kash123";
    const adminName = "Aakash KC";

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (existingAdmin) {
        console.log("Admin user already exists");
        return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = await prisma.user.create({
        data: {
            email: adminEmail,
            name: adminName,
            passwordHash,
            role: "SUPER_ADMIN", // adjust according to your enum/schema
        },
    });

    console.log("Admin created successfully:");
    console.log({
        id: admin.id,
        email: admin.email,
        role: admin.role,
    });
}

main()
    .catch((e) => {
        console.error("Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
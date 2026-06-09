import bcrypt from "bcryptjs";
import prisma from "../src/config/prisma.js";

async function createAdmin() {
  const existingAdmin = await prisma.user.findUnique({
    where: {
      username: "admin",
    },
  });

  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("Murukan@123", 10);

  await prisma.user.create({
    data: {
      username: "admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin user created successfully");
}

createAdmin()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Delete all records from all tables in the correct order (due to foreign keys)
    console.log("Clearing database...");
    
    await prisma.order.deleteMany({});
    console.log("✓ Deleted all orders");
    
    await prisma.product.deleteMany({});
    console.log("✓ Deleted all products");
    
    await prisma.setting.deleteMany({});
    console.log("✓ Deleted all settings");
    
    console.log("\n✅ Database cleared successfully!");
  } catch (error) {
    console.error("Error clearing database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

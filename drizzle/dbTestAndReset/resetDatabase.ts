/*
    To run this file: `yarn reset-db`
*/
import { sql } from 'drizzle-orm';
import { db } from "../database/db";

export async function resetDatabase() {
  try {
    console.log("🗑️ Resetting database...");

    // Truncate all tables and reset sequences
    await db.execute(sql`TRUNCATE TABLE customers, invoices RESTART IDENTITY CASCADE;`);

    console.log("✅ Database reset successfully!");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
  }
}

async function main() {
    await resetDatabase();
  }
  
  main().catch((err) => console.error("❌ Error:", err));
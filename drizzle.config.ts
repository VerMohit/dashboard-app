// Configuration file for Drizzle ORM
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config(); // Load .env file

// Check if POSTGRES_URL is defined before using it
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

export default defineConfig({
  schema: "drizzle/database/schema.ts",  // Path to your schema
  out: "drizzle/migrations",    // Path to migrations output
  dialect: "postgresql",                  // Specify PostgreSQL as the driver
  dbCredentials: {
    url: process.env.DATABASE_URL,  // Connection URL from .env
  },
});
import { Pool } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-serverless';

dotenv.config(); // Load .env file

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not defined in .env');
  process.exit(1); // Exit if the DATABASE_URL is missing
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  min: 4,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = drizzle({ client: pool });

console.log('Conenction successful!');

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
});

export const db = drizzle({ client: pool });

console.log('Conenction successful!');

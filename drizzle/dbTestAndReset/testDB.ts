import { sql } from 'drizzle-orm';

import { db } from '../database/db';  // Adjust the import path if necessary

async function testDbConnection() {
  try {
    // Attempt a simple query
    const result = await db.execute(sql`SELECT 1 as test`);
    console.log('Database connection successful:', result);
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testDbConnection();

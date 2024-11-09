import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config({ path: '.env.test' });

const testPool = new Pool({
  connectionString: process.env.TEST_DATABASE_URL,
});

// Global E2E test setup
beforeAll(async () => {
  // Create test database tables
  await testPool.query(`
    -- Add your test database schema here
    -- This will run before all E2E tests
  `);
});

// Global E2E test teardown
afterAll(async () => {
  await testPool.end();
});
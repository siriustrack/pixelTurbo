import app from "./app";
import * as dotenv from "dotenv";
import Logger from "./utils/logger";
import {
  monitorSystem,
  monitorDatabase,
  monitorClickhouseDatabase,
} from "./utils/monitoring";
import { Pool } from "pg";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Initialize database pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Start monitoring
monitorSystem();
monitorDatabase(pool);
monitorClickhouseDatabase();

// Start server
app.listen(PORT, () => {
  Logger.info(`Server is running on port ${PORT}`);
});

import fs from "fs";
import path from "path";
import pool from "./index";

async function setupDatabase() {
  try {
    // Read the schema file
    const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");

    // Execute the schema
    await pool.query(schema);
    console.log("Database schema created successfully");

    // Close the pool
    await pool.end();
  } catch (error) {
    console.error("Error setting up database:", error);
    process.exit(1);
  }
}

setupDatabase();

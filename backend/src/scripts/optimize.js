import pool from "../config/db.js";

async function optimizeDB() {
  try {
    console.log("Adding database indexes...");

    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);",
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);",
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);",
    );

    console.log(
      "Successfully created indexes on tasks table to optimize queries.",
    );
  } catch (error) {
    console.error("Error optimizing DB:", error);
  } finally {
    pool.end();
  }
}

optimizeDB();

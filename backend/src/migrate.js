import pool from "./config/db.js";

const runMigrations = async () => {
  try {
    console.log("Running database migrations...");

    // 1. Alter Users Table
    await pool.query(`
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(255),
            ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255),
            ADD COLUMN IF NOT EXISTS reset_password_token VARCHAR(255),
            ADD COLUMN IF NOT EXISTS reset_password_expires TIMESTAMP,
            ADD COLUMN IF NOT EXISTS theme VARCHAR(50) DEFAULT 'dark';
        `);
    console.log("Users table updated.");

    // 2. Create Activities Table
    await pool.query(`
            CREATE TABLE IF NOT EXISTS activities (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                action VARCHAR(255) NOT NULL,
                task_id INTEGER REFERENCES tasks(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    console.log("Activities table created.");

    // 3. Create Notifications Table
    await pool.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    console.log("Notifications table created.");

    // 4. Update Tasks Table for tags and status
    await pool.query(`
            ALTER TABLE tasks
            ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'TODO',
            ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
        `);
    console.log("Tasks table updated with status and tags.");

    // 5. Create Subtasks Table
    await pool.query(`
            CREATE TABLE IF NOT EXISTS subtasks (
                id SERIAL PRIMARY KEY,
                task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                is_completed BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    console.log("Subtasks table created.");

    console.log("All migrations completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

runMigrations();

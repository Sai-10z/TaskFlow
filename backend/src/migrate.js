import pool from "./config/db.js";

export const runMigrations = async (isStandalone = false) => {
  let retries = 10;
  while (retries > 0) {
    try {
      console.log("Running database migrations...");

      // 0. Ensure Users and Tasks tables exist
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          avatar_url VARCHAR(255),
          is_verified BOOLEAN DEFAULT FALSE,
          verification_token VARCHAR(255),
          reset_password_token VARCHAR(255),
          reset_password_expires TIMESTAMP,
          theme VARCHAR(50) DEFAULT 'dark',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          priority VARCHAR(50) DEFAULT 'MEDIUM',
          status VARCHAR(50) DEFAULT 'TODO',
          completed BOOLEAN DEFAULT FALSE,
          deadline TIMESTAMP,
          tags TEXT[] DEFAULT '{}',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

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

      // 4. Update Tasks Table for tags, completed, status and updated_at
      await pool.query(`
        ALTER TABLE tasks
        ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'TODO',
        ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
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
      if (isStandalone) process.exit(0);
      return;
    } catch (error) {
      console.error(`Migration attempt failed. Retrying in 2 seconds... (${retries} retries left)`, error.message);
      retries--;
      if (retries === 0) {
        console.error("Migration failed permanently:", error);
        if (isStandalone) process.exit(1);
        throw error;
      }
      await new Promise((res) => setTimeout(res, 2000));
    }
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations(true);
}


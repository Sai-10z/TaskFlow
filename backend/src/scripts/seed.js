import pool from "../config/db.js";

const tasksData = [
  // Work
  {
    title: "Finish UI redesign",
    description: "Complete the premium UI/UX redesign for TaskFlow.",
    priority: "HIGH",
    status: "IN_PROGRESS",
  },
  {
    title: "Deploy backend server",
    description: "Push the Node.js backend to production.",
    priority: "HIGH",
    status: "TODO",
  },
  {
    title: "Fix login authentication bug",
    description: "Resolve the JWT token expiration issue.",
    priority: "HIGH",
    status: "COMPLETED",
  },

  // Personal
  {
    title: "Buy groceries",
    description: "Milk, eggs, bread, and fruits.",
    priority: "MEDIUM",
    status: "TODO",
  },
  {
    title: "Pay electricity bill",
    description: "Pay the monthly utility bill online.",
    priority: "HIGH",
    status: "TODO",
  },
  {
    title: "Clean room",
    description: "Organize desk and vacuum the floor.",
    priority: "LOW",
    status: "IN_PROGRESS",
  },
  {
    title: "Read a book",
    description: "Read chapter 3 of 'Atomic Habits'.",
    priority: "LOW",
    status: "TODO",
  },

  // Study
  {
    title: "Complete React assignment",
    description: "Finish the final project for the frontend bootcamp.",
    priority: "HIGH",
    status: "IN_PROGRESS",
  },
  {
    title: "Learn Prisma ORM",
    description: "Watch the tutorial and build a sample app.",
    priority: "MEDIUM",
    status: "TODO",
  },
  {
    title: "Finish Python exercises",
    description: "Complete the daily LeetCode challenges.",
    priority: "LOW",
    status: "COMPLETED",
  },

  // Finance
  {
    title: "Pay rent",
    description: "Transfer rent for the month.",
    priority: "HIGH",
    status: "TODO",
  },
  {
    title: "Pay credit card bill",
    description: "Clear the outstanding balance.",
    priority: "HIGH",
    status: "TODO",
  },
];

async function seedTasks() {
  try {
    console.log("Starting database seeding...");

    // Find a user
    const userResult = await pool.query("SELECT id FROM users LIMIT 1");
    if (userResult.rows.length === 0) {
      console.log("No users found. Please register a user first.");
      process.exit(0);
    }

    const userId = userResult.rows[0].id;
    console.log(`Seeding tasks for user ID: ${userId}`);

    let inserted = 0;

    for (const task of tasksData) {
      // Check if task already exists
      const check = await pool.query(
        "SELECT id FROM tasks WHERE user_id = $1 AND title = $2",
        [userId, task.title],
      );
      if (check.rows.length === 0) {
        // Calculate realistic due dates
        const dueDate = new Date();
        if (task.status === "COMPLETED") {
          dueDate.setDate(dueDate.getDate() - Math.floor(Math.random() * 5));
        } else if (task.priority === "HIGH") {
          dueDate.setDate(dueDate.getDate() + 1); // due tomorrow
        } else {
          dueDate.setDate(
            dueDate.getDate() + Math.floor(Math.random() * 7) + 2,
          );
        }

        await pool.query(
          "INSERT INTO tasks (user_id, title, description, priority, status, deadline) VALUES ($1, $2, $3, $4, $5, $6)",
          [
            userId,
            task.title,
            task.description,
            task.priority,
            task.status,
            dueDate,
          ],
        );
        inserted++;
      }
    }

    console.log(`Successfully seeded ${inserted} new tasks.`);
  } catch (error) {
    console.error("Error seeding tasks:", error);
  } finally {
    pool.end();
  }
}

seedTasks();

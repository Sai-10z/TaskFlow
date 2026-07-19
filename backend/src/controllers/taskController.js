import pool from "../config/db.js";

export const createTask = async (req, res) => {
  try {
    let { title, description, priority, deadline, status, tags, subtasks } =
      req.body;

    title = title?.trim();
    description = description?.trim();

    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const result = await pool.query(
      `
            INSERT INTO tasks
            (
                title,
                description,
                priority,
                deadline,
                status,
                user_id,
                tags
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING *
            `,
      [
        title,
        description || null,
        priority || "LOW",
        deadline || null,
        status || "TODO",
        req.user.id,
        tags || [],
      ],
    );

    const newTask = result.rows[0];

    // Handle subtasks if provided
    if (subtasks && Array.isArray(subtasks) && subtasks.length > 0) {
      for (const st of subtasks) {
        if (st.title && st.title.trim()) {
          await pool.query(
            "INSERT INTO subtasks (task_id, title, is_completed) VALUES ($1, $2, $3)",
            [newTask.id, st.title.trim(), st.is_completed || false],
          );
        }
      }
    }

    await pool.query(
      "INSERT INTO activities (user_id, action, task_id) VALUES ($1, $2, $3)",
      [req.user.id, "Task Created", newTask.id],
    );

    // Fetch the fully constructed task with subtasks to return
    const finalResult = await pool.query(
      `
            SELECT 
                t.*,
                COALESCE(
                    (SELECT json_agg(s ORDER BY s.id ASC) FROM subtasks s WHERE s.task_id = t.id), 
                    '[]'
                ) AS subtasks
            FROM tasks t
            WHERE t.id = $1
            `,
      [newTask.id],
    );

    res.status(201).json(finalResult.rows[0]);
  } catch (error) {
    console.error("Create Task Error:", error);

    res.status(500).json({
      message: "Failed to create task",
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const result = await pool.query(
      `
            SELECT 
                t.*,
                COALESCE(
                    (SELECT json_agg(s ORDER BY s.id ASC) FROM subtasks s WHERE s.task_id = t.id), 
                    '[]'
                ) AS subtasks
            FROM tasks t
            WHERE t.user_id = $1
            ORDER BY
                t.completed ASC,
                t.created_at DESC
            `,
      [req.user.id],
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get Tasks Error:", error);

    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    let {
      title,
      description,
      priority,
      deadline,
      status,
      completed,
      tags,
      subtasks,
    } = req.body;

    title = title?.trim();
    description = description?.trim();

    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const result = await pool.query(
      `
            UPDATE tasks
            SET
                title = $1,
                description = $2,
                priority = $3,
                deadline = $4,
                status = COALESCE($5, status),
                completed = COALESCE($6, completed),
                tags = COALESCE($7, tags),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $8
            AND user_id = $9
            RETURNING *
            `,
      [
        title,
        description || null,
        priority || "LOW",
        deadline || null,
        status,
        completed,
        tags,
        req.params.id,
        req.user.id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const updatedTask = result.rows[0];

    // Handle subtasks update (wholesale replace for simplicity)
    if (subtasks && Array.isArray(subtasks)) {
      // Delete existing subtasks
      await pool.query("DELETE FROM subtasks WHERE task_id = $1", [
        updatedTask.id,
      ]);
      // Insert new subtasks
      for (const st of subtasks) {
        if (st.title && st.title.trim()) {
          await pool.query(
            "INSERT INTO subtasks (task_id, title, is_completed) VALUES ($1, $2, $3)",
            [updatedTask.id, st.title.trim(), st.is_completed || false],
          );
        }
      }
    }

    await pool.query(
      "INSERT INTO activities (user_id, action, task_id) VALUES ($1, $2, $3)",
      [req.user.id, "Task Updated", updatedTask.id],
    );

    // Fetch the fully constructed task with subtasks to return
    const finalResult = await pool.query(
      `
            SELECT 
                t.*,
                COALESCE(
                    (SELECT json_agg(s ORDER BY s.id ASC) FROM subtasks s WHERE s.task_id = t.id), 
                    '[]'
                ) AS subtasks
            FROM tasks t
            WHERE t.id = $1
            `,
      [updatedTask.id],
    );

    res.status(200).json(finalResult.rows[0]);
  } catch (error) {
    console.error("Update Task Error:", error);

    res.status(500).json({
      message: "Failed to update task",
    });
  }
};

export const completeTask = async (req, res) => {
  try {
    const result = await pool.query(
      `
            UPDATE tasks
            SET
                completed = TRUE,
                status = 'COMPLETED',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            AND user_id = $2
            RETURNING *
            `,
      [req.params.id, req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await pool.query(
      "INSERT INTO activities (user_id, action, task_id) VALUES ($1, $2, $3)",
      [req.user.id, "Task Completed", result.rows[0].id],
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Complete Task Error:", error);

    res.status(500).json({
      message: "Failed to complete task",
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const result = await pool.query(
      `
            DELETE FROM tasks
            WHERE id = $1
            AND user_id = $2
            RETURNING *
            `,
      [req.params.id, req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await pool.query(
      "INSERT INTO activities (user_id, action) VALUES ($1, $2)",
      [req.user.id, "Task Deleted"],
    );

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete Task Error:", error);

    res.status(500).json({
      message: "Failed to delete task",
    });
  }
};

export const getTaskStats = async (req, res) => {
  try {
    const result = await pool.query(
      `
            SELECT
                COUNT(*) AS total,
                COUNT(*) FILTER (WHERE completed = TRUE) AS completed,
                COUNT(*) FILTER (WHERE completed = FALSE) AS pending,
                COUNT(*) FILTER (WHERE priority = 'HIGH') AS high,
                COUNT(*) FILTER (WHERE priority = 'MEDIUM') AS medium,
                COUNT(*) FILTER (WHERE priority = 'LOW') AS low
            FROM tasks
            WHERE user_id = $1
            `,
      [req.user.id],
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Get Task Stats Error:", error);

    res.status(500).json({
      message: "Failed to fetch task statistics",
    });
  }
};

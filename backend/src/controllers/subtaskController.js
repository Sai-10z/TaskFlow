import pool from "../config/db.js";

export const addSubtask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Subtask title is required" });
    }

    // Verify task belongs to user
    const taskCheck = await pool.query(
      "SELECT id FROM tasks WHERE id = $1 AND user_id = $2",
      [taskId, req.user.id],
    );

    if (taskCheck.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    const result = await pool.query(
      "INSERT INTO subtasks (task_id, title) VALUES ($1, $2) RETURNING *",
      [taskId, title.trim()],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Add Subtask Error:", error);
    res.status(500).json({ message: "Failed to add subtask" });
  }
};

export const updateSubtask = async (req, res) => {
  try {
    const { taskId, subtaskId } = req.params;
    const { title, is_completed } = req.body;

    // Verify task belongs to user
    const taskCheck = await pool.query(
      "SELECT id FROM tasks WHERE id = $1 AND user_id = $2",
      [taskId, req.user.id],
    );

    if (taskCheck.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    const result = await pool.query(
      `
            UPDATE subtasks
            SET 
                title = COALESCE($1, title),
                is_completed = COALESCE($2, is_completed)
            WHERE id = $3 AND task_id = $4
            RETURNING *
            `,
      [title?.trim(), is_completed, subtaskId, taskId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Subtask not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Update Subtask Error:", error);
    res.status(500).json({ message: "Failed to update subtask" });
  }
};

export const deleteSubtask = async (req, res) => {
  try {
    const { taskId, subtaskId } = req.params;

    // Verify task belongs to user
    const taskCheck = await pool.query(
      "SELECT id FROM tasks WHERE id = $1 AND user_id = $2",
      [taskId, req.user.id],
    );

    if (taskCheck.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    const result = await pool.query(
      "DELETE FROM subtasks WHERE id = $1 AND task_id = $2 RETURNING *",
      [subtaskId, taskId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Subtask not found" });
    }

    res.status(200).json({ message: "Subtask deleted successfully" });
  } catch (error) {
    console.error("Delete Subtask Error:", error);
    res.status(500).json({ message: "Failed to delete subtask" });
  }
};

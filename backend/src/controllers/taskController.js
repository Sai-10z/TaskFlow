import pool from "../config/db.js";

export const createTask = async (req, res) => {
    try {
        let {
            title,
            description,
            priority,
            deadline,
            status,
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
            INSERT INTO tasks
            (
                title,
                description,
                priority,
                deadline,
                status,
                user_id
            )
            VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING *
            `,
            [
                title,
                description || null,
                priority || "LOW",
                deadline || null,
                status || "TODO",
                req.user.id,
            ]
        );
        
        await pool.query(
            "INSERT INTO activities (user_id, action, task_id) VALUES ($1, $2, $3)",
            [req.user.id, "Task Created", result.rows[0].id]
        );

        res.status(201).json(result.rows[0]);
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
            SELECT *
            FROM tasks
            WHERE user_id = $1
            ORDER BY
                completed ASC,
                created_at DESC
            `,
            [req.user.id]
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
            completed
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
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $7
            AND user_id = $8
            RETURNING *
            `,
            [
                title,
                description || null,
                priority || "LOW",
                deadline || null,
                status,
                completed,
                req.params.id,
                req.user.id,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Task not found",
            });
        }
        
        await pool.query(
            "INSERT INTO activities (user_id, action, task_id) VALUES ($1, $2, $3)",
            [req.user.id, "Task Updated", result.rows[0].id]
        );

        res.status(200).json(result.rows[0]);
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
            [
                req.params.id,
                req.user.id,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        await pool.query(
            "INSERT INTO activities (user_id, action, task_id) VALUES ($1, $2, $3)",
            [req.user.id, "Task Completed", result.rows[0].id]
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
            [
                req.params.id,
                req.user.id,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        await pool.query(
            "INSERT INTO activities (user_id, action) VALUES ($1, $2)",
            [req.user.id, "Task Deleted"]
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
            [req.user.id]
        );

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Get Task Stats Error:", error);

        res.status(500).json({
            message: "Failed to fetch task statistics",
        });
    }
};
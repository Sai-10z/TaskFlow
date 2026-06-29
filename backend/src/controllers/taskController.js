import pool from "../config/db.js";

export const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO tasks (title, description, user_id)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [title, description, req.user.id]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
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
            ORDER BY created_at DESC
            `,
            [req.user.id]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
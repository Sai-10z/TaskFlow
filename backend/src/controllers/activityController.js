import pool from "../config/db.js";

export const getActivities = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM activities WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20",
            [req.user.id]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getProductivityStreak = async (req, res) => {
    try {
        // Calculate streak based on consecutive days with at least one "Task Completed" activity
        // For simplicity in this demo, let's just return a mock streak or count distinct days
        const result = await pool.query(
            `
            SELECT COUNT(DISTINCT DATE(created_at)) as streak
            FROM activities
            WHERE user_id = $1 AND action = 'Task Completed'
            `,
            [req.user.id]
        );
        
        res.status(200).json({ streak: parseInt(result.rows[0].streak) || 0 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

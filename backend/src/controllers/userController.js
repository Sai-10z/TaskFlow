import pool from "../config/db.js";

export const updateProfile = async (req, res) => {
    try {
        const { username, email, theme } = req.body;
        
        const result = await pool.query(
            `
            UPDATE users
            SET username = COALESCE($1, username),
                email = COALESCE($2, email),
                theme = COALESCE($3, theme)
            WHERE id = $4
            RETURNING id, username, email, avatar_url, theme, is_verified
            `,
            [username, email, theme, req.user.id]
        );
        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        
        const avatarUrl = `/uploads/${req.file.filename}`;
        
        const result = await pool.query(
            "UPDATE users SET avatar_url = $1 WHERE id = $2 RETURNING id, username, email, avatar_url, theme, is_verified",
            [avatarUrl, req.user.id]
        );
        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

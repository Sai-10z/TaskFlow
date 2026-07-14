import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import generateToken from "../utils/generateToken.js";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "../utils/sendEmail.js";

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = uuidv4();

        const result = await pool.query(
            `
            INSERT INTO users (username, email, password, verification_token)
            VALUES ($1, $2, $3, $4)
            RETURNING id, username, email
            `,
            [username, email, hashedPassword, verificationToken]
        );

        const user = result.rows[0];

        // Mock sending email
        await sendEmail({
            to: email,
            subject: "Verify your Email - TaskFlow",
            text: `Please verify your email by clicking: http://localhost:5173/verify-email/${verificationToken}`,
            html: `<p>Please verify your email by clicking: <a href="http://localhost:5173/verify-email/${verificationToken}">here</a></p>`
        });

        res.status(201).json({
            message: "User registered successfully. Please check your email to verify your account.",
            token: generateToken(user.id),
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const result = await pool.query(
            "UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE verification_token = $1 RETURNING id",
            [token]
        );
        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Invalid or expired verification token" });
        }
        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        res.status(200).json({
            message: "Login successful",
            token: generateToken(user.id),
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar_url: user.avatar_url,
                is_verified: user.is_verified,
                theme: user.theme
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, username, email, avatar_url, is_verified, theme FROM users WHERE id = $1",
            [req.user.id]
        );
        if(result.rows.length === 0) return res.status(404).json({message: "User not found"});
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const resetToken = uuidv4();
        const expires = new Date(Date.now() + 3600000); // 1 hour
        
        await pool.query(
            "UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3",
            [resetToken, expires, email]
        );
        
        await sendEmail({
            to: email,
            subject: "Reset your Password - TaskFlow",
            text: `Reset your password by clicking: http://localhost:5173/reset-password/${resetToken}`,
            html: `<p>Reset your password by clicking: <a href="http://localhost:5173/reset-password/${resetToken}">here</a></p>`
        });
        
        res.status(200).json({ message: "Password reset link sent to your email" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        
        const result = await pool.query(
            "SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > NOW()",
            [token]
        );
        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            "UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2",
            [hashedPassword, result.rows[0].id]
        );
        
        res.status(200).json({ message: "Password reset successful. You can now login." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const result = await pool.query(
        "SELECT id, username, email FROM users WHERE id = $1",
        [decoded.id],
      );

      req.user = result.rows[0];

      next();
    } else {
      return res.status(401).json({
        message: "Not authorized",
      });
    }
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

export default protect;

import express from "express";
import cors from "cors";

import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "TaskFlow API Running"
    });
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);

export default app;
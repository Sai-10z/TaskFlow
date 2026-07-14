import express from "express";
import { getActivities, getProductivityStreak } from "../controllers/activityController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getActivities);
router.get("/streak", protect, getProductivityStreak);

export default router;

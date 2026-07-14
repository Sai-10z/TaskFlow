import express from "express";

import {
    createTask,
    getTasks,
    deleteTask,
    completeTask,
    updateTask,
    getTaskStats,
} from "../controllers/taskController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Dashboard Statistics
|--------------------------------------------------------------------------
*/

router.get("/stats", protect, getTaskStats);

/*
|--------------------------------------------------------------------------
| Task CRUD
|--------------------------------------------------------------------------
*/

router.post("/", protect, createTask);

router.get("/", protect, getTasks);

router.put("/:id", protect, updateTask);

router.delete("/:id", protect, deleteTask);

router.patch("/:id/complete", protect, completeTask);

export default router;
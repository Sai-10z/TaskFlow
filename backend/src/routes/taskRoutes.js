import express from "express";

import {
  createTask,
  getTasks,
  deleteTask,
  completeTask,
  updateTask,
  getTaskStats,
} from "../controllers/taskController.js";

import {
  addSubtask,
  updateSubtask,
  deleteSubtask,
} from "../controllers/subtaskController.js";

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

/*
|--------------------------------------------------------------------------
| Subtasks
|--------------------------------------------------------------------------
*/

router.post("/:taskId/subtasks", protect, addSubtask);
router.put("/:taskId/subtasks/:subtaskId", protect, updateSubtask);
router.delete("/:taskId/subtasks/:subtaskId", protect, deleteSubtask);

export default router;

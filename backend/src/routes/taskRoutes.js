import express from "express";

import {

    createTask,
    getTasks,
    deleteTask,
    completeTask,
    updateTask

} from "../controllers/taskController.js";


import protect from "../middleware/authMiddleware.js";


const router = express.Router();


router.post("/", protect, createTask);

router.get("/", protect, getTasks);

router.delete("/:id", protect, deleteTask);

router.put("/:id", protect, updateTask);

router.patch("/:id/complete", protect, completeTask);



export default router;
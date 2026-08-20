import express from "express";

import {
    createTask,
    deleteTask,
    getAllTasks,
    updateTask
} from "../controller/task.controller.js";

import {
    authenticateToken
} from "../middleware/auth.middleware.js";

const TaskRouter = express.Router();

TaskRouter.get(
    "/",
    authenticateToken,
    getAllTasks
);

TaskRouter.post(
    "/",
    authenticateToken,
    createTask
);

TaskRouter.put(
    "/:id",
    authenticateToken,
    updateTask
);

TaskRouter.delete(
    "/:id",
    authenticateToken,
    deleteTask
);

export { TaskRouter };
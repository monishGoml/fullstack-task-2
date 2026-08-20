import type {
    Response,
    NextFunction
} from "express";

import crypto from "crypto";

import type { Task } from "../types/task.types.js";

import {
    readTasks,
    writeTasks
} from "../utils/task.util.js";

import type { AuthRequest } from "../middleware/auth.middleware.js";


export const getAllTasks = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const tasks = await readTasks();

        const userTasks = tasks.filter(
            task => task.userId === userId
        );

        return res.status(200).json({
            message: "Tasks fetched successfully",
            tasks: userTasks
        });

    } catch (err) {
        next(err);
    }
};


export const createTask = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            title,
            description
        } = req.body;

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        if (!title || !description) {
            return res.status(400).json({
                message: "Title and description are required"
            });
        }

        const tasks = await readTasks();

        const newTask:Task = {
            id: crypto.randomUUID(),
            title,
            description,
            userId
        };

        await writeTasks([
            ...tasks,
            newTask
        ]);

        return res.status(201).json({
            message: "Task created successfully",
            task: newTask
        });

    } catch (err) {
        next(err);
    }
};


export const updateTask = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const {
            title,
            description
        } = req.body as {
            title: string;
            description: string;
        };

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        if (!title || !description) {
            return res.status(400).json({
                message: "Title and description are required"
            });
        }

        const tasks = await readTasks();

        const taskIndex = tasks.findIndex(
            task =>
                task.id === id &&
                task.userId === userId
        );

        if (taskIndex === -1) {
            return res.status(404).json({
                message: "Task not found"
            });
        }
        const task = tasks[taskIndex];
        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }
        tasks[taskIndex] = {
            ...tasks[taskIndex]!,
            title,
            description
        };

        await writeTasks(tasks);

        return res.status(200).json({
            message: "Task updated successfully",
            task: tasks[taskIndex]
        });

    } catch (err) {
        next(err);
    }
};
export const deleteTask = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const tasks = await readTasks();

        const taskIndex = tasks.findIndex(
            task =>
                task.id === id &&
                task.userId === userId
        );

        if (taskIndex === -1) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        const deletedTask = tasks[taskIndex];

        tasks.splice(taskIndex, 1);

        await writeTasks(tasks);

        return res.status(200).json({
            message: "Task deleted successfully",
            task: deletedTask
        });

    } catch (err) {
        next(err);
    }
};
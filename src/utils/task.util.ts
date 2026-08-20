import { readFile, writeFile } from "fs/promises";
import type { Task } from "../types/task.types.js";

const TASK_DB = "./data/tasks.json";

export const readTasks = async (): Promise<Task[]> => {
    const data = await readFile(TASK_DB, "utf-8");

    return JSON.parse(data) as Task[];
};

export const writeTasks = async (
    tasks: Task[]
): Promise<void> => {
    await writeFile(
        TASK_DB,
        JSON.stringify(tasks, null, 2)
    );
};
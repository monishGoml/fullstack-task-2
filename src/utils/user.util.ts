import { readFile, writeFile } from "fs/promises";

import type { User } from "../types/user.types.js";

const USER_DB = "./data/users.json";

export const readUsers = async (): Promise<User[]> => {
    const data = await readFile(USER_DB, "utf-8");

    return JSON.parse(data) as User[];
};

export const writeUsers = async (
    users: User[]
): Promise<void> => {
    await writeFile(
        USER_DB,
        JSON.stringify(users, null, 2)
    );
};
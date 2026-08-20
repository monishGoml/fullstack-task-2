import type {
    Request,
    Response,
    NextFunction
} from "express";

import bcrypt from "bcrypt";
import crypto from "crypto";

import type { User } from "../types/user.types.js";

import {
    readUsers,
    writeUsers
} from "../utils/user.util.js";

import { generateJWT } from "../utils/generateJWT.util.js";


export const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required"
            });
        }

        const users = await readUsers();

        const existingUser = users.find(
            user => user.email === email
        );

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const newUser: User = {
            id: crypto.randomUUID(),
            name,
            email,
            password: hashedPassword
        };

        await writeUsers([
            ...users,
            newUser
        ]);

        const token = generateJWT(newUser.id);

        return res.status(201).json({
            message: "User registered successfully",

            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            },

            token
        });

    } catch (err) {
        next(err);
    }
};


export const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const users = await readUsers();

        const user = users.find(
            user => user.email === email
        );

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordValid =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = generateJWT(user.id);

        return res.status(200).json({
            message: "Login successful",

            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },

            token
        });

    } catch (err) {
        next(err);
    }
};
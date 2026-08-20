import express from "express";

import {
    registerUser,
    loginUser
} from "../controller/user.controller.js";

const UserRouter = express.Router();

UserRouter.post(
    "/register",
    registerUser
);

UserRouter.post(
    "/login",
    loginUser
);

export { UserRouter };
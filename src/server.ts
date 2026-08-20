import express from "express";

import { UserRouter } from "./routes/user.routes.js";
import { TaskRouter } from "./routes/task.routes.js";

import { error } from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());

app.use("/users", UserRouter);

app.use("/tasks", TaskRouter);

app.use(error);

app.listen(5000, () => {
    console.log(
        "Server is running on port 5000"
    );
});
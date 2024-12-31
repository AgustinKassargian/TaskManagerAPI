import { Router } from "express";
import authentication from "../middlewares/authentication.middleware.js";
import { createTask, deleteTask, editTask, getTaskByID, getTasks,getMyTasks } from "../controllers/task.controller.js";
import { validateCreateTasks, validateGetTaskByID, validateEditTask, validateDeleteTask, validateGetTasks } from "../services/taskValidators.js";

const router = Router();

router.post(
    '/tasks',
    authentication,
    validateCreateTasks,
    createTask
);

router.get(
    '/tasks',
    authentication,
    validateGetTasks,
    getTasks
);

router.get(
    '/tasks/:id',
    authentication,
    validateGetTaskByID,
    getTaskByID
);


router.put(
    '/tasks/:id',
    authentication,
    validateEditTask,
    editTask
);

router.delete(
    '/tasks/:id',
    authentication,
    validateDeleteTask,
    deleteTask
);


router.get(
    '/my-tasks',
    authentication,
    getMyTasks
)

export default router;

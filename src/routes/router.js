import { Router } from "express";
import taskRoutes from "./task.routes.js"; 
import userRoutes from "./user.routes.js"

const router = Router();

router.use(taskRoutes);
router.use(userRoutes);

export default router;
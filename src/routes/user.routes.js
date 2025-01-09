import { Router } from "express";

import authentication from "../middlewares/authentication.middleware.js";
import {register, login, logout, verify} from "../controllers/auth.controller.js"

const router = Router();


router.post(
    '/register',
    register
);

router.post(
    '/login',
    login
);

router.put(
    '/logout',
    authentication,
    logout
)

router.get('/auth/verify', verify)

export default router;

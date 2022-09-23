import { Router } from "express";

import userController from "../controller/UserController.js";
import CheckTotken from "../../../config/auth/checkTotken.js";

const router = new Router();

router.post('/api/user/auth', userController.getAccessToken);

router.use(CheckTotken);

router.get('/api/user/email/:email', userController.findByEmail);

export default router;
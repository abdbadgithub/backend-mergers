import { Router } from "express";
import { register, login, protectedRoute } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// @ts-ignore
router.post("/register", register);
// @ts-ignore
router.post("/login", login);
// @ts-ignore
router.get("/protected", authenticate, protectedRoute);

export default router;

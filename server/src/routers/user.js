import { Router } from "express";
import { register, login, refreshToken, getUserRole } from "../controllers/users.js";

const router = Router();

router.post("/signup", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.get("/role/:id", getUserRole);

export default router;

import { Router } from "express";
import { regisetUser } from "../controllers/register.controller";

const router = Router();

router.post("/register", regisetUser);

export default router;
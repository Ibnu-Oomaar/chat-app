import { Router } from "express";
import { updateStatus, getOnlineUsers } from "../controllers/status.controller";

const router = Router();

router.post("/update", updateStatus);
router.get("/online", getOnlineUsers);

export default router;
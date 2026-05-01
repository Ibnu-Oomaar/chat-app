import { Router } from "express";
import { createRoom, getRooms } from "../controllers/room.controller";

const router = Router();

router.post("/", createRoom);
router.get("/", getRooms);

export default router;
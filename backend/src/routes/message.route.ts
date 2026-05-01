import { Router } from "express";
import { getMessages, sendMessage } from "../controllers/messages.controller";
import { jwtMiddleware } from "../middlewares/jwt.middleware";

const router = Router();

router.use(jwtMiddleware);

router.post("/", sendMessage);
router.get("/", getMessages);

export default router;
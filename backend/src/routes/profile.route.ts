import { Router } from "express";
import multer from "multer";
import { getProfile, updateProfile } from "../controllers/profile.controller";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/:userId", getProfile);
router.put("/:userId", upload.single("profilePic"), updateProfile);

export default router;

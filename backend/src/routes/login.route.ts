import { Router } from "express";
import loginUser, {
    deleteUser,
    getAllUsers,
    getOneUser,
    updateUser
} from "../controllers/login.controller";

const router = Router();

// AUTH
router.post("/login", loginUser);

// USERS CRUD
router.get("/users", getAllUsers);
router.get("/users/:id", getOneUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
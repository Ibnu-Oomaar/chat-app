import { Router } from "express";
import loginUser, { deleteUser, getAllUsers, getOneUser, updateUser } from "../controllers/login.controller";


const router = Router();

router.post("/login", loginUser);
router.get("/users", getAllUsers);
router.get("/users/:id", getOneUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);


export default loginUser;
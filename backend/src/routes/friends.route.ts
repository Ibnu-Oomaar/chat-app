import { Router } from "express";
import { 
    sendRequest, 
    acceptRequest, 
    getFriends, 
    rejectRequest, 
    getPendingRequests 
} from "../controllers/friends.controller";

const router = Router();

router.post("/request", sendRequest);
router.put("/accept/:id", acceptRequest);
router.delete("/reject/:id", rejectRequest);
router.get("/:userId", getFriends);
router.get("/pending/:userId", getPendingRequests);

export default router;
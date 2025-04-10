import express from "express";
import { protecteRoute } from "../middleware/auth.middleware.js";
import {getUsersForSidebar,getMessages,sendMessage} from "../controllers/message.controllers.js"

const router=express.Router();


router.get("/users",protecteRoute,getUsersForSidebar)

router.get("/:id",protecteRoute,getMessages)

router.post("/send/:id",protecteRoute,sendMessage)
export default router;
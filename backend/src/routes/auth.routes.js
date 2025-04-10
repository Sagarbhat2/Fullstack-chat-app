import express from "express";
import {login, logout, signup,updateprofile,checkAuth} from "../controllers/auth.controllers.js"
import {protecteRoute} from "../middleware/auth.middleware.js"

const router=express.Router();

router.post("/signup",signup);

router.post("/login",login);
router.post("/logout",logout);

router.put("/update-profile",protecteRoute,updateprofile)

router.get("/check",protecteRoute,checkAuth)


export default router;
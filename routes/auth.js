import express from "express";
import { getUser, login, editProfile } from "../controllers/auth.js";
import { loginRules, validator } from "../middleware/validator.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.post("/login", loginRules(), validator, login);
router.get("/", verifyToken, getUser);
router.put("/:id", verifyToken, editProfile )

export default router;

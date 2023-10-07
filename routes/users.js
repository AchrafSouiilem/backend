import express from "express";
import {
  // getUsers,
  getUserFriends,
  addFriend,
  removeFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/* READ */
// router.get("/", /*verifyToken,*/ getUsers);

router.get("/:id/friends", verifyToken, getUserFriends);

/* UPRATE */
router.patch("/:id/:friendId", /*verifyToken,*/ addFriend);

/* DELETE */
router.patch("/:id/:friendId/remove", removeFriend)

export default router;

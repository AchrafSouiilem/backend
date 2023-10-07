import express from "express";
import {getFeedPosts, getUserPosts, likePost , deletePost, updatePost} from "../controllers/posts.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);

router.get("/:userId", verifyToken, getUserPosts)

/* DELETE */ 
router.delete("/:id", verifyToken, deletePost)

/* UPDATE */ 
router.put("/:id", verifyToken, updatePost)

router.patch("/:id/like", /*verifyToken,*/ likePost);



export default router 
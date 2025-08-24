import { Router } from "express";
import {createComment, fetchComments, showComment, updateComment, deleteComment } from "../Controller/CommentController.js"

const router = Router()

router.get("/", fetchComments);
router.get("/:id", showComment);
router.post("/", createComment);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;
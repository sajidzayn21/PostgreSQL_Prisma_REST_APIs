import { Router } from "express";
import userRoutes from "./userRoutes.js";
import postRoutes from "./postRoutes.js"
import commentRoutes from "./commentRoutes.js"

const router = Router();

// user routes 
router.use("/api/user", userRoutes)
// post routes
router.use("/api/post", postRoutes)
//comment routes
router.use("/api/comment", commentRoutes)

export default router;
import { Router } from "express";
import { createPlayground, getAllPlayground } from "../controller/playgroundController.js";
import { authMiddleware } from "../lib/middleware.js";

const router = Router()


router.route("/all").get(authMiddleware, getAllPlayground)
router.route("/create").post(authMiddleware, createPlayground)


export default router



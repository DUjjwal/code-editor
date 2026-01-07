import { Router } from "express";
import { createPlayground, deletePlayground, duplicatePlayground, getAllPlayground, unmarkPlayground, markPlayground, editPlayground } from "../controller/playgroundController.js";
import { authMiddleware } from "../lib/middleware.js";

const router = Router()


router.route("/all").get(authMiddleware, getAllPlayground)
router.route("/create").post(authMiddleware, createPlayground)
router.route("/delete").post(authMiddleware, deletePlayground)
router.route("/duplicate").post(authMiddleware, duplicatePlayground)
router.route("/mark").post(authMiddleware, markPlayground)
router.route("/unmark").post(authMiddleware, unmarkPlayground)
router.route("/edit").post(authMiddleware, editPlayground)


export default router



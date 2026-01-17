import { Router } from "express";
import { authMiddleware } from "../lib/middleware.js";
import { getOneTimeToken, verifyOneTimeToken } from "../controller/authController.js";

const router = Router()

router.route("/get").get(authMiddleware, getOneTimeToken)
router.route("/verify").get(verifyOneTimeToken)


export default router
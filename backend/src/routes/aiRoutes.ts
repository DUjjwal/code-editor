import Router from "express"
import { authMiddleware } from "../lib/middleware.js"
import {getAllChat, getResponse} from "./../controller/aiController.js"

const router = Router()


router.route("/chat").post(authMiddleware, getResponse)
router.route("/all").get(authMiddleware, getAllChat)


export default router
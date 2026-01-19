import Router from "express"
import { authMiddleware } from "../lib/middleware.js"
import {getResponse} from "./../controller/aiController.js"

const router = Router()


router.route("/chat").post(authMiddleware, getResponse)


export default router
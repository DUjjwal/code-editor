import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import {prisma} from "./prisma.js"


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    
    try {
        const token = req.cookies.token

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!)

        if(!decodedToken) {
            return res.status(400).json({
                message: "invalid token"
            })
        }

        

    }catch(error) {
        console.log(error)
        return res.status(400).json({
            message: "token not found"
        })
    }

}

export const status = async (req: Request, res: Response, next: NextFunction) => {
    
    console.log("entered")
    try {
        const token = req.cookies.token

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!)

        if(!decodedToken) {
            return res.status(400).json({
                message: "invalid token"
            })
        }

        return res.status(200).json({
            message: "authenticated user"
        })
        

    }catch(error) {
        console.log(error)
        return res.status(400).json({
            message: "token not found"
        })
    }

}
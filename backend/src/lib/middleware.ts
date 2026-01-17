import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import {prisma} from "./prisma.js"


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    
    try {
        const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "")

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!)

        if(!decodedToken) {
            return res.status(400).json({
                message: "invalid token"
            })
        }

        //@ts-ignore
        req.user = decodedToken.user

        next()


        

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
        let decodedToken = null
        if(req.cookies.token) {
            decodedToken = jwt.verify(req.cookies.token, process.env.JWT_SECRET!)
        }
            
        else if(req.header("Authorization")?.replace("Bearer ", "")) {
            const token = JSON.parse(req.header("Authorization")?.replace("Bearer ", "")!)
            decodedToken = jwt.verify(token, process.env.JWT_SECRET!)
        }

        

        
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
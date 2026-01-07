import { Request, Response, NextFunction } from "express"
import {prisma} from "../lib/prisma.js"

export const getAllPlayground = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //@ts-ignore
        const userId = req.user

        const playgrounds = await prisma.playground.findMany({
            where: {
                userId: userId
            }
        })

        return res.status(200).json({
            playgrounds: playgrounds
        })
    }catch(error) {
        console.log(error)
        return res.status(400).json({
            message: "db error"
        })
    }
    


}

export const createPlayground = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const {title,template} = req.body
        //@ts-ignore
        const userId = req.user

        
        const playground = await prisma.playground.create({
            data: {
                title: title,
                template: template.toUpperCase(),
                userId: userId
            }
        })

        return res.status(200).json({
            message: "create success",
            playground
        })
        
    }catch(err) {
        console.log(err)
        return res.status(400).json({
            message: "db error"
        })
    }
    



}
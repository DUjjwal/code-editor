import { Request, Response, NextFunction } from "express"
import {prisma} from "../lib/prisma.js"

export const getAllPlayground = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //@ts-ignore
        const userId = req.user

        const playgrounds = await prisma.playground.findMany({
            where: {
                userId: userId
            },
            include: {
                user: {
                    select: {
                        name: true,
                        picture: true
                    }
                }
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
        const {title,template, description} = req.body
        //@ts-ignore
        const userId = req.user

        
        const playground = await prisma.playground.create({
            data: {
                title: title,
                template: template.toUpperCase(),
                userId: userId,
                description
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

export const deletePlayground = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.body
        
        await prisma.playground.delete({
            where: {
                id: id
            }
        })

        return res.status(200).json({
            message: "delete success"
        })

    }catch(error) {
        console.log(error)
        return res.status(400).json({
            message: "delete error"
        })
    }
}

export const duplicatePlayground = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.body

        const oldPlayground = await prisma.playground.findUnique({
            where: {
                id: id
            }
        })
        
        if(oldPlayground) {
            const newPlayground = await prisma.playground.create({
                data: {
                    title: (oldPlayground.title + "(DUPLICATE)"),
                    template: oldPlayground.template,
                    //@ts-ignore
                    userId: req.user
                }
            })

            return res.status(200).json({
                message: "duplicate success",
                playground: newPlayground
            })

        }else {
            return res.status(400).json({
                message: "playground not found"
            })
        }
    }catch(error) {
        console.log(error)
        return res.status(400).json({
            message: "duplicate error"
        })
    }
}

export const markPlayground = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.body

        await prisma.playground.update({
            where: {
                id: id
            },
            data: {
                isMarked: true
            }
        })

        return res.status(200).json({
            message: "mark success"
        })
    }catch(err) {
        console.log(err)
        return res.status(400).json({
            message: "mark failed"
        })
    }

    
}

export const unmarkPlayground = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.body

        await prisma.playground.update({
            where: {
                id: id
            },
            data: {
                isMarked: false
            }
        })

        return res.status(200).json({
            message: "unmark success"
        })
    }catch(err) {
        console.log(err)
        return res.status(400).json({
            message: "unmark failed"
        })
    }

    
}

export const editPlayground = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {title,description,id} = req.body
    
        await prisma.playground.update({
            where: {id:id},
            data: {
                title,
                description
            }
        })
    
        return res.status(200).json({
            message: "update success"
        })

    }catch(err) {
        console.log(err)
        return res.status(400).json({
            message: "update error"
        })
    }
}
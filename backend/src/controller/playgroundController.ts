import { Request, Response, NextFunction } from "express"

export const getAllPlayground = (req: Request, res: Response, next: NextFunction) => {
    console.log("working")
    //@ts-ignore
    console.log(req.user)
    return res.status(200).json({
        message: "all playgrounds"
    })
}
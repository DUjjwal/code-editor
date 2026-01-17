import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

export const getOneTimeToken = async (req: Request, res: Response, next: NextFunction) => {
    
    //@ts-ignore
    const user = req.user

    const token = jwt.sign({ "user": user}, process.env.JWT_SECRET!, {
        expiresIn: 300
    })

    return res.status(200).json({
        message: "valid for 5 min",
        token
    })


}

//verify short lived token to give long time access token

export const verifyOneTimeToken = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const token = req.header("Authorization")?.replace("Bearer ", "")

        if(token) {
            const decoded = await jwt.verify(token, process.env.JWT_SECRET!)

            if(!decoded) {
                return res.status(400).json({
                    message: "not valid token"
                })
            }
            else {
                //@ts-ignore
                const token = jwt.sign({ "user": decoded.user}, process.env.JWT_SECRET!, {
                    expiresIn: "1h"
                })

                return res.status(200).json({
                    message: "long live token",
                    token
                })


            }
        }
        else {
            return res.status(400).json({
                message: "not valid token"
            })
        }


    }catch(err) {
        console.log(err)
        return res.status(400).json({
            message: "token not found in headers"
        })
    }
}


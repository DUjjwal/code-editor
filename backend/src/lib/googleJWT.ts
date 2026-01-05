import { Request, Response, NextFunction } from "express"
import { OAuth2Client } from "google-auth-library"
import axios from "axios"
import {prisma} from "./prisma.js"
import jwt from "jsonwebtoken"


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const db = prisma


export const googleAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.body.access_token

    try {

        const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const payload = response.data

        const existingUser = await db.user.findUnique({
            where: {
                email: payload.email
            }
        })

        if(!existingUser) {
            const newUser = await db.user.create({
                data: {
                    name: payload.name,
                    first_name: payload.given_name,
                    family_name: payload.family_name,
                    email: payload.email,
                    picture: payload.picture ?? ""
                }
            })

            const token = jwt.sign({"user": newUser.id}, process.env.JWT_SECRET! , {
                expiresIn: "1h"
            })

            const options = {
                httpOnly: true,
            }

            return res.status(200).cookie("token", token, options).json({
                message:" login success"
            })

        }
        else {
            const token = jwt.sign({"user": existingUser.id}, process.env.JWT_SECRET! , {
                expiresIn: "1h"
            })

            const options = {
                httpOnly: true,
            }

            return res.status(200).cookie("token", token, options).json({
                message:" login success"
            })
        }
        

        

    }catch(error) {
        console.log(error)
        return res.status(400).json({
            message: "google-token-error"
        })
    }    



}
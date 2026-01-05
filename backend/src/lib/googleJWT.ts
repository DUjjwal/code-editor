import { Request, Response, NextFunction } from "express"
import { OAuth2Client } from "google-auth-library"
import axios from "axios"

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const googleAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.body.access_token

    try {

        const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        
        console.log(response.data)

        return res.status(200).json({
            message: "success"
        })

    }catch(error) {
        console.log(error)
        return res.status(400).json({
            message: "google-token-error"
        })
    }    



}
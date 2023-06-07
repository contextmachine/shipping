import type {NextApiRequest, NextApiResponse} from 'next'
import {UserController} from "../app/controllers"
import {middleware} from "utils"
import {cors, ApiToken, UserRole} from "@/pages/api/app/middlewares"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await middleware(req, res, cors)

    const userController = new UserController(res)

    switch (req.method) {
        case 'GET':
            await userController.getLocation(req.query.id as string)
            break
        default:
            res.status(405).json({status: 'error'})
            break
    }
}

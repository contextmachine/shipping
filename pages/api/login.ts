import type {NextApiRequest, NextApiResponse} from 'next'
import {LoginController} from "../../notuse/controllers"
import {middleware} from "utils";
import {cors} from "@/pages/api/app/middlewares";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await middleware(req, res, cors)

    const loginController: LoginController = new LoginController(res)
    const email: string = req.body.email
    const password: string = req.body.password

    if (req.method === 'POST') {
        await loginController.authenticate(email, password)
    }

    res.status(405).json({status: 'error'})
}

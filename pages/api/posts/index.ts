import type { NextApiRequest, NextApiResponse } from 'next'
import { ShippingController } from "../app/controllers"
import { middleware } from "utils"
import { cors, ApiToken, UserRole } from "@/pages/api/app/middlewares"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await middleware(req, res, cors)
    const shippingController = new ShippingController(req, res)

    switch (req.method) {
        case 'GET':
            const { page, limit } = req.query
            await shippingController.getCollection(parseInt(page as string), parseInt(limit as string))
            break
        case 'POST':
            await shippingController.store(req.body)
            break
        default:
            res.status(405).json({ status: 'error' })
            break
    }
}

import { NextApiRequest, NextApiResponse } from "next"
import { Shipping, User } from "@/pages/api/app/interfaces"
import { ShippingRepository } from "@/pages/api/app/repositories"
import { Auth } from "@/pages/api/app/services"

export default class ShippingController {
    private readonly req: NextApiRequest
    private res: NextApiResponse
    private shippingRepository: ShippingRepository

    constructor(req: NextApiRequest, res: NextApiResponse) {
        this.req = req
        this.res = res
        this.shippingRepository = new ShippingRepository()
    }

    public getCollection = async (page?: number, limit?: number) => {
        if (!page || !limit) {
            return await this.shippingRepository
                .findAll()
                .then((posts: Shipping[]) => this.res.status(200).json(posts))
                .catch(e => this.res.status(500).json({ status: 'error', message: e.message }))
        }

        await this.shippingRepository
            .findAllPaginate(page, limit)
            .then(posts => this.res.status(200).json(posts))
            .catch(e => this.res.status(500).json({ status: 'error', message: e.message }))
    }

    public getItem = async (id: string) => {
        await this.shippingRepository
            .findOne(id)
            .then((post: Shipping) => {
                if (!post) {
                    this.res.status(404).json({ status: 'error' })
                }

                this.res.status(200).json(post)
            })
            .catch(e => this.res.status(500).json({ status: 'error', message: e.message }))
    }

    public store = async (shipping: Shipping) => {
        const user = await Auth(this.req) as User
        shipping.from = user.id ?? ''

        console.log(shipping)

        await this.shippingRepository
            .create(shipping)
            .then(() => this.res.status(200).json({ status: 'success' }))
            .catch(e => this.res.status(500).json({ status: 'error', message: e.message }))
    }

    public update = async (id: string, shipping: Shipping) => {
        await this.shippingRepository
            .update(id, shipping)
            .then((posts: Shipping[]) => {
                if (!posts) {
                    this.res.status(404).json({ status: 'error' })
                }

                this.res.status(200).json({ status: 'success' })
            })
            .catch(e => this.res.status(500).json({ status: 'error', message: e.message }))
    }

    public destroy = async (id: string) => {
        await this.shippingRepository
            .destroy(id)
            .then((posts: Shipping[]) => {
                if (!posts) {
                    this.res.status(404).json({ status: 'error' })
                }

                this.res.status(200).json({ status: 'success' })
            })
            .catch(e => this.res.status(500).json({ status: 'error', message: e.message }))
    }
}

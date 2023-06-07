import db from '../database'
import { paginate, slugify, base64ToFile, getUploadPath } from 'utils'
import { Shipping, Repository } from '../interfaces'
import { ShippingModel } from '../models'
import fs from "fs"
import { randomUUID } from 'crypto'

export default class ShippingRepository implements Repository {
    private postModel: ShippingModel

    constructor() {
        this.postModel = new ShippingModel()
    }

    read = async () => {
        await db.read()
        return db.data?.shippings ?? []
    }

    write = async (data: { shippings: Shipping[] }) => {
        Object.assign(db.data as Object, { shippings: data.shippings })
        return await db.write()
    }

    add = async (post: Shipping) => {
        let shippings = await this.read()
        shippings.push(this.postModel.set(post))

        return await this.write({ shippings: shippings })
    }

    findOne = async (id: string) => await this.findOneBy('id', id)

    findOneBy = async (key: string, value: string) => {
        let shippings: Shipping[] = await this.read()
        shippings = shippings.filter(shipping => shipping[key as keyof Shipping] === value)
        return shippings[0]
    }

    findAll = async () => await this.read()

    findAllPaginate = async (page: number = 1, limit: number = 15) => {
        const shippings: Shipping[] = await this.findAll()
        return paginate(shippings as [], page, limit)
    }

    findAllBy = async (key: string, value: string) => {
        let posts: Shipping[] = await this.read()
        return posts.filter(post => post[key as keyof Shipping] === value)
    }

    create = async (shipping: Shipping) => {
        const fileName: string = shipping.id + '_QR.png'
        base64ToFile(shipping.qr, fileName)
        shipping.qr = fileName
        return await this.add(shipping).then(async () => await this.read())
    }

    update = async (id: string, newPost: Shipping) => {
        let posts: Shipping[] = await this.read()

        posts = posts.map(post => {
            if (post.id !== id) { return post }

            // TODO обновление статуса

            return this.postModel.set({ ...post, ...newPost })
        })

        return await this.write({ shippings: posts }).then(async () => await this.read())
    }

    destroy = async (id: string) => {
        const post: Shipping = await this.findOne(id)

        try {
            fs.unlinkSync(getUploadPath(post.qr))
        } catch (err) { }

        let posts: Shipping[] = await this.read()
        posts = posts.filter(post => post.id !== id)

        return await this.write({ shippings: posts }).then(async () => await this.read())
    }
}

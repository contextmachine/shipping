import { Shipping } from '../interfaces'
import { randomUUID } from 'crypto'

export default class ShippingModel {
    private id?: string
    private from?: string
    private to?: string
    private contentType?: string
    private count?: number
    private status?: string
    private createdAt?: string
    private sendedAt?: string
    private recievedAt?: string
    private qr?: string

    public get = (): Shipping => {
        return {
            id: this.id ?? '',
            from: this.from ?? '',
            to: this.to ?? '',
            contentType: this.contentType ?? '',
            count: this.count ?? 0,
            status: this.status ?? '',
            createdAt: this.createdAt ?? '',
            sendedAt: this.sendedAt ?? '',
            recievedAt: this.recievedAt ?? '',
            qr: this.qr ?? ''
        }
    }

    public set = (shipping: Shipping): Shipping => {
        this.id = shipping.id
        this.from = shipping.from
        this.to = shipping.to
        this.contentType = shipping.contentType
        this.count = shipping.count
        this.status = shipping.status
        this.createdAt = shipping.createdAt ?? new Date().toISOString()
        this.sendedAt = shipping.sendedAt
        this.recievedAt = shipping.recievedAt
        this.qr = shipping.qr

        return this.get()
    }
}

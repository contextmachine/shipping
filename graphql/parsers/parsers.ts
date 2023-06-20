import { Shipping } from "@/interfaces/Shipping"

export const parseShipping = (data: any): Shipping | undefined => {
    if (data) {
        const o = data.mfb_shipping_shippings_by_pk
        const shipping: Shipping = {
            id: o.id,
            contentType: o.content,
            count: o.count,
            createdAt: o.createdAt,
            recievedAt: o.recievedAt,
            sendedAt: o.sendetAt,
            status: o.status,
            from: o.user_from.location,
            to: o.user_to.location,
            fromId: o.user_from.id,
            toId: o.user_to.id
        }
        return shipping

    }
}

export const parseShippings = (data: any): Shipping[] => {

    if (data) {
        return data.mfb_shipping_shippings.map((o: any) => ({
            id: o.id,
            contentType: o.content,
            count: o.count,
            qr: o.qr,
            createdAt: o.createdAt,
            recievedAt: o.recievedAt,
            sendedAt: o.sendedAt,
            status: o.status,
            from: o.user_from.location,
            to: o.user_to.location
        }))
    } else {
        return []
    }
}
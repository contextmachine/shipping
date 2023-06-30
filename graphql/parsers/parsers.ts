import { Shipping } from "@/interfaces/Shipping"
import { Location } from "@/interfaces/Location"
import { User } from "@/interfaces/UserInterface"

export const parseShipping = (data: any): Shipping | undefined => {
    if (data) {
        const o = data.mfb_shipping_shippings_by_pk
        const shipping: Shipping = {
            id: o.id,
            number: o.number,
            contentType: o.content,
            count: o.count,
            createdAt: o.createdAt,
            recievedAt: o.recievedAt,
            sendedAt: o.sendedAt,
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
            number: o.number,
            contentType: o.content,
            count: o.count,
            createdAt: o.createdAt,
            recievedAt: o.recievedAt,
            sendedAt: o.sendedAt,
            status: o.status,
            from: o.user_from.location,
            to: o.user_to.location,
            fromId: o.user_from.id,
            toId: o.user_to.id
        }))
    } else {
        return []
    }
}


export const parseUsers = (data: any): User[] => {
    if (data) {
        return data.mfb_shipping_users.map((o: any) => ({
            id: o.id,
            login: o.login,
            location: o.location,
            role: o.role
        }))
    } else {
        return []
    }
}

export const parseUser = (data: any): User | undefined => {
    if (data) {
        const o = data.mfb_shipping_users_by_pk
        const user: User = {
            id: o.id,
            location: o.location,
            login: o.login,
            role: o.role,
        }
        return user
    }
}

export const parseLocations = (res: any): Location[] => {
    if (res)
        return res
            .mfb_shipping_users_aggregate
            .nodes
            .map((x: any) => ({ id: x.id, location: x.location }))
    else
        return []
}

export const parseContentTypes = (res: any): string[] => {
    if (res)
        return res
            .mfb_shipping_content_types
            .map((x: any) => x.name)
    else
        return []
}
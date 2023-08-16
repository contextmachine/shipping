import { SortState } from "@/components/ShippingList"
import { Shipping } from "@/interfaces/Shipping"

const statusSortValue = [
    {
        status: 'created',
        value: 0
    },
    {
        status: 'sended',
        value: 1
    },
    {
        status: 'recieved',
        value: 2
    },
]

export const statusSortValueMap = new Map(statusSortValue.map(x => ([x.status, x.value])))


export const dateComapare = (a: string | undefined, b: string | undefined) => {

    if (a && b) {
        return new Date(a).valueOf() - new Date(b).valueOf()
    } else {
        if (!a && b) {
            return 1
        } else if (a && !b) {
            return -1
        } else {
            return 0
        }
    }
}


export const sortShippings = (shippings: Shipping[], sortState: SortState): Shipping[] => {
    switch (sortState.field) {
        case 'id':
            return shippings.sort((a, b) => b.number - a.number)
        case 'status':
            return shippings.sort((a, b) => statusSortValueMap.get(a.status)! - statusSortValueMap.get(b.status)!)
        case 'contentType':
            return shippings.sort((a, b) => a.contentType.localeCompare(b.contentType))
        case 'count':
            return shippings.sort((a, b) => b.count - a.count)
        case 'from':
            return shippings.sort((a, b) => a.from.localeCompare(b.from))
        case 'to':
            return shippings.sort((a, b) => a.to.localeCompare(b.to))
        case 'created':
            return shippings.sort((a, b) => dateComapare(b.createdAt, a.createdAt))
        case 'sended':
            return shippings.sort((a, b) => dateComapare(b.sendedAt, a.sendedAt))
        case 'recieved':
            return shippings.sort((a, b) => dateComapare(b.sendedAt, a.sendedAt))
        default:
            return shippings
    }
}
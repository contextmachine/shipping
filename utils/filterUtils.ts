import { TableFilter } from "@/components/ShippingList"
import { Shipping } from "@/interfaces/Shipping"
import { dateInRange } from "@/utils";

export type FilterFunction = (shipping: Shipping, user: string) => boolean

(shipping: Shipping, user: string) => shipping ? true : false


export const filterList: { value: string, label: string, filter: FilterFunction }[] = [
    {
        value: 'all',
        label: "Показать все",
        filter: (shipping: Shipping, user: string) => shipping ? true : false
    },
    {
        value: 'sendedToMe',
        label: "Что едет ко мне",
        filter: (shipping: Shipping, user: string) => shipping.toId === user && (shipping.status === 'sended' || shipping.status === 'created')
    },
    {
        value: 'createdByMe',
        label: "Что я создал",
        filter: (shipping: Shipping, user: string) => shipping.fromId === user && shipping.status === 'created'
    },
    {
        value: 'SendedByMe',
        label: "Что я отправил",
        filter: (shipping: Shipping, user: string) => shipping.fromId === user && shipping.status === 'sended'
    },
    {
        value: 'DeliveredByMe',
        label: "Что я доставил",
        filter: (shipping: Shipping, user: string) => shipping.fromId === user && shipping.status === 'recieved'
    },
    {
        value: 'RecievedByMe',
        label: "Что я принял",
        filter: (shipping: Shipping, user: string) => shipping.toId === user && shipping.status === 'recieved'
    }
]

export const filterMap = new Map(filterList.map(x => ([x.value, x.filter])))


export const filterShippings = (shippings: Shipping[], columnFilter: TableFilter): Shipping[] => {
    switch (columnFilter.field) {
        case 'status':
            return shippings.filter(x => x.status === columnFilter.value)
        case 'contentType':
            return shippings.filter(x => x.contentType === columnFilter.value)
        case 'from':
            return shippings.filter(x => x.from === columnFilter.value)
        case 'to':
            return shippings.filter(x => x.to === columnFilter.value)
        case 'created':
            return shippings.filter(x => dateInRange(x.createdAt, columnFilter.value))
        case 'sended':
            return shippings.filter(x => dateInRange(x.sendedAt, columnFilter.value))
        case 'recieved':
            return shippings.filter(x => dateInRange(x.recievedAt, columnFilter.value))
        default:
            return shippings
    }
}
import { Shipping } from "@/interfaces/Shipping"

export type UserFilterFunction = (shipping: Shipping, user: string) => boolean


export interface UserFilterOption {
    value: string,
    label: string,
    filter: UserFilterFunction
}

export const userFilterList: UserFilterOption[] = [
    {
        value: 'all',
        label: "Показать все",
        filter: (shipping: Shipping, user: string) => true
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

export const userFilterMap = new Map(userFilterList.map(x => ([x.value, x.filter])))






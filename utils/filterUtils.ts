import { TableFilter } from "@/components/ShippingList"
import { Shipping } from "@/interfaces/Shipping"
import { dateInRange } from "@/utils";
import { DateRange } from "./types";

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


const columnFilterList = [
    {
        field: 'status',
        filter: (shippings: Shipping[], value: any) => shippings.filter(x => x.status === value)
    }, {
        field: 'contentType',
        filter: (shippings: Shipping[], value: any) => shippings.filter(x => x.contentType === value)
    }, {
        field: 'from',
        filter: (shippings: Shipping[], value: any) => shippings.filter(x => x.from === value)
    }, {
        field: 'to',
        filter: (shippings: Shipping[], value: any) => shippings.filter(x => x.to === value)
    }, {
        field: 'createdAt',
        filter: (shippings: Shipping[], value: any) => shippings.filter(x => dateInRange(x.createdAt, value))
    }, {
        field: 'sendedAt',
        filter: (shippings: Shipping[], value: any) => shippings.filter(x => dateInRange(x.sendedAt, value))
    }, {
        field: 'recievedAt',
        filter: (shippings: Shipping[], value: any) => shippings.filter(x => dateInRange(x.recievedAt, value))
    },

]

export const columnFilterMap: Map<string, (shippings: Shipping[], value: any) => Shipping[]> = new Map(columnFilterList.map(x => ([x.field, x.filter])))


const columnFilterList2 = [
    {
        field: 'status',
        filter: (value: string, record: any) => record.status === value
    }, {
        field: 'contentType',
        filter: (value: string, record: any) => record.contentType === value
    }, {
        field: 'from',
        filter: (value: string, record: any) => record.from === value
    }, {
        field: 'to',
        filter: (value: string, record: any) => record.to === value
    }, {
        field: 'createdAt',
        filter: (value: DateRange, record: any) => dateInRange(record.createdAt, value)
    }, {
        field: 'sendedAt',
        filter: (value: DateRange, record: any) => dateInRange(record.sendedAt, value)
    }, {
        field: 'recievedAt',
        filter: (value: DateRange, record: any) => dateInRange(record.recievedAt, value)
    },

]

export const columnFilterMap2 = new Map(columnFilterList2.map(x => ([x.field, x.filter])))
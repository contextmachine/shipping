import { Shipping } from "@/interfaces/Shipping"
import { ColumnsType } from "antd/es/table"
import ShippingTotal from "./LogisticCell"

export interface LogisticDataType {
    key: string
    contentType: string
    push2hot: ShippingByStatus
    hot2frez: ShippingByStatus
    frez2hot: ShippingByStatus
    hot2lahta: ShippingByStatus
    hot2min: ShippingByStatus
    min2hot: ShippingByStatus
    expand: boolean
}

export interface ShippingByStatus {
    recieved: Shipping[],
    created: Shipping[],
    sended: Shipping[],
}

export const logisticColumns: ColumnsType<LogisticDataType> = [
    {
        title: 'Контент',
        dataIndex: 'contentType',
        key: 'contentType',
        align: 'center',
    },
    {
        title: 'Пушкино → Хотьково',
        dataIndex: 'push2hot',
        key: 'push2hot',
        align: 'center',
        render: (value, record, index) => <ShippingTotal data={record.push2hot} expand={record.expand} />,
    },
    {
        title: 'Хотьково → Фрезеровка',
        dataIndex: 'hot2frez',
        key: 'hot2frez',
        align: 'center',
        render: (value, record, index) => <ShippingTotal data={record.hot2frez} expand={record.expand} />,
    },
    {
        title: 'Фрезеровка → Хотьково',
        dataIndex: 'frez2hot',
        key: 'frez2hot',
        align: 'center',
        render: (value, record, index) => <ShippingTotal data={record.frez2hot} expand={record.expand} />,
    },

    {
        title: 'Хотьково → Минск',
        dataIndex: 'hot2min',
        key: 'hot2min',
        align: 'center',
        render: (value, record, index) => <ShippingTotal data={record.hot2min} expand={record.expand} />,
    },
    {
        title: 'Минск → Хотьково',
        dataIndex: 'min2hot',
        key: 'min2hot',
        align: 'center',
        render: (value, record, index) => <ShippingTotal data={record.min2hot} expand={record.expand} />,
    },

    {
        title: 'Хотьково → Лахта',
        dataIndex: 'hot2lahta',
        key: 'hot2lahta',
        align: 'center',
        render: (value, record, index) => <ShippingTotal data={record.hot2lahta} expand={record.expand} />,
    },
]

export const logisticStatusFilters = [
    {
        key: `push2hot`,
        filter: (shipping: Shipping) =>
            shipping.from === '1 — Пушкино' &&
            shipping.to === '2 — Хотьково',
    },
    {
        key: `hot2lahta`,
        filter: (shipping: Shipping) =>
            shipping.from === '2 — Хотьково' &&
            shipping.to === '4 — Лахта',
    },
    {
        key: `hot2frez`,
        filter: (shipping: Shipping) =>
            shipping.from === '2 — Хотьково' &&
            shipping.to === '3 — Фрезеровка',
    },
    {
        key: `frez2hot`,
        filter: (shipping: Shipping) =>
            shipping.from === '3 — Фрезеровка' &&
            shipping.to === '2 — Хотьково',
    },
    {
        key: `hot2min`,
        filter: (shipping: Shipping) =>
            shipping.from === '2 — Хотьково' &&
            shipping.to === '3/1 — Фрез Минск',
    },
    {
        key: `min2hot`,
        filter: (shipping: Shipping) =>
            shipping.from === '3/1 — Фрез Минск' &&
            shipping.to === '2 — Хотьково',
    },
]


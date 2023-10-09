import { Shipping } from "@/interfaces/Shipping"
import { formatDate, formatLocation } from "@/utils"
import { Divider, QRCode, Space, Tag } from "antd"
import { ColumnsType } from "antd/es/table"
import Link from "next/link"
import { statusMap } from "../Status"
import { SmallTag } from "../summary/Columns"




export interface LogisticDataType {
    key: string
    contentType: string
    push2hot: ShippingByStatus
    hot2frez: ShippingByStatus
    frez2hot: ShippingByStatus
    hot2lahta: ShippingByStatus
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
        title: 'Хотьково → Лахта',
        dataIndex: 'hot2lahta_created',
        key: 'hot2lahta_created',
        align: 'center',
        render: (value, record, index) => <ShippingTotal data={record.hot2lahta} expand={record.expand} />,
    },
]



interface CellContentProps {
    data: ShippingByStatus
    expand: boolean
}

const ShippingTotal = (props: CellContentProps): JSX.Element => {

    const { data, expand } = props

    const total = (Object.values(data) as Shipping[][])
        .flatMap(x => x)
        .map(x => x.count)
        .reduce((a, c) => a + c, 0)


    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }}>
        <div className="d-flex flex-row justify-content-start" style={{ fontSize: '16px' }}>
            {total}
        </div>
        <br />
        <div className="d-flex flex-row flex-wrap justify-content-center">
            {Object.entries(data).map(([key, _]) =>
                <div key={key}>
                    <Tag key={key} color={statusMap.get(key)!.color}>
                        {data[key as keyof ShippingByStatus].map(x => x.count).reduce((a, c) => a + c, 0)}
                    </Tag>
                </div>
            )}
            {expand && <Divider />}
        </div>
        <div className="d-flex flex-row flex-wrap justify-content-center">
            {expand && (Object.entries(data)
                .flatMap(([_, shippings]) => shippings) as Shipping[])
                .map((shipping, i) =>
                    <div key={i}>
                        <SmallTag key={i} $status={shipping.status}>
                            <Link
                                href={`/shippings/${shipping.id}`}
                                style={{ textDecoration: 'none', color: 'inherit', fontSize: 10 }}
                                title={generateToolTip(shipping)}
                            >{shipping.number}</Link>
                        </SmallTag>
                    </div>
                )
            }
        </div>
    </div >



}

const generateToolTip = (shipping: Shipping) => {
    const from = formatLocation(shipping.from)
    const to = formatLocation(shipping.to)
    const tooltip = [
        `${from} → ${to}`,
        `${shipping.contentType}    ${shipping.count} шт.`,
        `${statusMap.get(shipping.status)!.label} ${statusTime(shipping)}`
    ].join('\n')
    return tooltip
}

const statusTime = (shipping: Shipping) => {
    switch (shipping.status) {
        case 'created':
            return formatDate(shipping.createdAt)
        case 'sended':
            return formatDate(shipping.sendedAt)
        case 'recieved':
            return formatDate(shipping.recievedAt)
        default:
            return '-'
    }
}

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
]


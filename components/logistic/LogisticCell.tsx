import { Shipping } from "@/interfaces/Shipping"
import { Divider, Tag } from "antd"
import { statusMap } from "../Status"
import { ShippingByStatus } from "./LogisticColumns"
import styled from "styled-components"
import Link from "next/link"
import { formatDate, formatLocation } from "@/utils"

interface CellContentProps {
    data: ShippingByStatus
    expand: boolean
}


export const SmallTag = styled.div<{ $status: string }>`
    display: flex;
    background-color: ${({ $status }) => statusMap.get($status)?.hexColorBg};
    border: 1px solid ${({ $status }) => statusMap.get($status)?.hexColor};
    color: ${({ $status }) => statusMap.get($status)?.hexColor};
    height: 16px;
    border-radius: 10px;
    padding: 2px 2px 2px 2px;
    margin: 2px;
    align-items: center;
    font-size: 11px;
`

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


export default function ShippingTotal(props: CellContentProps): JSX.Element {

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


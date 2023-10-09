import { Shipping } from "@/interfaces/Shipping"
import { formatDate, formatLocation } from "@/utils"
import { ColumnsType } from "antd/es/table"
import Link from "next/link"
import styled from "styled-components"
import { statusMap } from "../Status"
import { Summary, SummaryData, SummaryDataType } from "./Summary"


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

export const summaryColumns: ColumnsType<SummaryDataType> = [
    {
        title: 'Контент',
        dataIndex: 'content',
        key: 'content',
        width: '10%',
        align: 'center',
    },
    {
        title: 'Принято',
        dataIndex: 'recieved',
        key: 'recieved',
        width: '30%',
        align: 'center',
        render: (value, record, index) => getSummary(record, 'recieved'),
    },
    {
        title: 'Создано',
        dataIndex: 'created',
        key: 'created',
        width: '30%',
        align: 'center',
        render: (value, record, index) => getSummary(record, 'created'),
    },
    {
        title: 'Отправлено',
        dataIndex: 'sended',
        key: 'sended',
        width: '30%',
        align: 'center',
        render: (value, record, index) => getSummary(record, 'sended'),
    },

]

export const getSummary = (summary: Summary, type: keyof Summary) => {

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

    const buildData = (destination: string, summary: SummaryData) => {

        const elements = [
            <div key='count'>{summary.count}</div>,
            <div key='arrow' className="align-self-center mx-1" style={{ color: 'gray', fontSize: 12 }}>→</div>,
            <div key='dest' className="align-self-center" style={{ color: 'gray', fontSize: 12 }}>{formatLocation(destination)}</div>,
        ]

        if (type === 'recieved') elements.reverse()

        const result = <div>
            <div className="d-flex flex-row align-middle justify-content-center" >
                {elements}
            </div>
            <div className="d-flex flex-row flex-wrap align-middle justify-content-center">
                {summary.shippings
                    .sort((a, b) => a.number - b.number)
                    .map((shipping, i) =>
                        <SmallTag key={i} $status={shipping.status}>
                            <Link
                                href={`/shippings/${shipping.id}`}
                                style={{ textDecoration: 'none', color: 'inherit', fontSize: 10 }}
                                title={generateToolTip(shipping)}
                            >{shipping.number}</Link>
                        </SmallTag>
                    )}
            </div>
        </div>

        return result
    }

    const result = Array.from(summary[type].entries())
        .map(([destination, summary]) => buildData(destination, summary))
        .map((x, i, arr) =>
            <div key={i}>
                {x}
                {!(i === arr.length - 1) && <br />}
            </div>)


    return result.length > 0 ? result : '-'
}
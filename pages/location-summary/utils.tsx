import { statusColorMap, statusMap } from "@/components/Status"
import { Shipping } from "@/interfaces/Shipping"
import { formatDate, formatLocation } from "@/utils"
import Link from "next/link"

export interface Summary {
    recieved: SummaryByDestination,
    created: SummaryByDestination,
    sended: SummaryByDestination,
}

interface SummaryData {
    count: number,
    shippings: Shipping[]
}

type SummaryByDestination = Map<string, SummaryData>
type SummaryByType = Map<string, Summary>
type SummaryByLocation = Map<string, SummaryByType>

export const addShippingToSummary = (summaryByLocation: SummaryByLocation, shipping: Shipping, status: 'recieved' | 'created' | 'sended') => {

    let location: string
    let destination: string

    if (status === 'created' || status === 'sended') {
        location = shipping.from
        destination = shipping.to
    } else {
        location = shipping.to
        destination = shipping.from
    }

    if (!summaryByLocation.has(location)) {
        summaryByLocation.set(location, new Map<string, Summary>())
    }

    const summaryByType = summaryByLocation.get(location) as SummaryByType

    if (!summaryByType.has(shipping.contentType)) {
        summaryByType.set(shipping.contentType, {
            recieved: new Map<string, SummaryData>(),
            created: new Map<string, SummaryData>(),
            sended: new Map<string, SummaryData>()
        })
    }
    const summary = summaryByType.get(shipping.contentType) as Summary

    if (!summary[status].has(destination)) {
        summary[status].set(destination, { count: 0, shippings: [] })
    }

    const summaryByDestination = summary[status].get(destination) as SummaryData

    summaryByDestination.count = summaryByDestination.count + shipping.count
    summaryByDestination.shippings.push(shipping)

}

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
            `${statusMap.get(shipping.status)} ${statusTime(shipping)}`
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
            <div className="d-flex flex-row align-middle justify-content-center">
                {elements}
            </div>
            <div className="d-flex flex-row flex-wrap align-middle justify-content-center">
                {summary.shippings
                    .sort((a, b) => a.number - b.number)
                    .map((shipping, i) =>
                        <span key={i} className="d-flex mx-1 justify-content-center" style={{
                            backgroundColor: statusColorMap.get(shipping.status),
                            height: 15,
                            borderRadius: 6,
                            width: 20
                        }}>
                            <Link
                                href={`/shippings/${shipping.id}`}
                                style={{ textDecoration: 'none', color: 'black', fontSize: 10 }}
                                title={generateToolTip(shipping)}
                            >{shipping.number}</Link>
                        </span>
                    )}
            </div>
        </div>

        return result
    }

    const result = Array.from(summary[type].entries())
        .map(([destination, summary]) => buildData(destination, summary))
        .map((x, i) => <div key={i}>{x}</div>)


    return result.length > 0 ? result : '-'
}
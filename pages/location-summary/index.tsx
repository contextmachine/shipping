import { _Head } from "@/components"
import { Header } from "@/components/Header"
import { useEffect, useState } from 'react';
import { useQuery } from "@apollo/client";
import { GET_SHIPPINGS } from "@/graphql/queries";
import { parseShippings } from "@/graphql/parsers/parsers";
import { dateInRange, formatDate, formatLocation } from "@/utils";
import { DateRange } from "@/utils/types";
import DateRangePickerComponent from "@/components/DateRangePicker";
import Link from "next/link"
import { Shipping } from "@/interfaces/Shipping";
import { statusColorMap, statusMap } from "@/components/Status";
import 'rsuite/dist/rsuite-no-reset.min.css';


export interface Summary {
    recieved: SummaryByDestination,
    created: SummaryByDestination,
    sended: SummaryByDestination,
}

export interface SummaryData {
    count: number,
    shippings: Shipping[]
}

type SummaryByDestination = Map<string, SummaryData>
type SummaryByType = Map<string, Summary>
type SummaryByLocation = Map<string, SummaryByType>

const addShippingToSummary = (summaryByLocation: SummaryByLocation, shipping: Shipping, status: 'recieved' | 'created' | 'sended') => {

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

const getSummary = (summary: Summary, type: keyof Summary) => {

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


export default function LocationSummary() {

    const [dateRange, setDateRange] = useState<DateRange | undefined | null>()
    const { data } = useQuery(GET_SHIPPINGS)
    const [summary, setSummary] = useState<Map<string, Map<string, Summary>> | undefined>()

    useEffect(() => {
        if (dateRange && data) {
            const shippingList = parseShippings(data)

            const summary = new Map<string, Map<string, Summary>>()

            shippingList.forEach(shipping => {
                if (dateInRange(shipping.recievedAt, dateRange)) {
                    addShippingToSummary(summary, shipping, 'recieved')
                }
                if (dateInRange(shipping.createdAt, dateRange)) {
                    addShippingToSummary(summary, shipping, 'created')
                }
                if (dateInRange(shipping.sendedAt, dateRange)) {
                    addShippingToSummary(summary, shipping, 'sended')
                }
            })

            setSummary(summary)


        }
    }, [data, dateRange])

    return <>
        <_Head title="Сводка по локациям" />

        <main className="container mt-3">
            <Header>
                <div className="d-flex flex-end">
                    <Link href="/" className="btn btn-sm btn-primary">
                        Список отправок
                    </Link>
                </div>
            </Header>
            <div className="d-flex flex-row mt-3">
                <h3>Сводка по локациям</h3>
                <div className="d-inline-flex flex-column mx-5">
                    <DateRangePickerComponent dateRange={dateRange} setDateRange={setDateRange} />
                </div>
            </div>
            {summary &&
                Array.from(summary.entries())
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([location, types]) =>
                        <div key={location}>
                            <table className="table table-striped table-sm text-center">
                                <thead>
                                    <tr>
                                        <th colSpan={4} color={'#111111'}>{location}</th>
                                    </tr>
                                    <tr className="justify-content-center">
                                        <th scope="col">Контент</th>
                                        <th scope="col">Принято</th>
                                        <th scope="col">Создано</th>
                                        <th scope="col">Отправлено</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.from(types.entries())
                                        .sort((a, b) => a[0].localeCompare(b[0]))
                                        .map(([type, summary]) => {
                                            return <>
                                                <tr key={type} className="align-middle justify-content-center" >
                                                    <td width="40">{type}</td>
                                                    <td width="110">{getSummary(summary, 'recieved')}</td>
                                                    <td width="110">{getSummary(summary, 'created')}</td>
                                                    <td width="110">{getSummary(summary, 'sended')}</td>
                                                </tr>
                                            </>
                                        })}
                                </tbody>
                            </table>
                        </div>)
            }
        </main>
    </>
}








import { _Head } from "@/components"
import { Header } from "@/components/Header"
import Link from "next/link"
import { DateRangePicker } from 'rsuite'

import { useEffect, useState } from 'react';
import 'rsuite/dist/rsuite-no-reset.min.css';
import { useQuery } from "@apollo/client";
import { GET_SHIPPINGS } from "@/graphql/queries";
import { Shipping } from "@/interfaces/Shipping";
import { groupByMultipleKeys, groupByOneKey } from "@/utils";
import { parseShippings } from "@/graphql/parsers/parsers";

type DateRange = [Date, Date]

interface SummaryData {
    count: number,
    shippings: Shipping[]
}

type SummaryByDestination = Map<string, SummaryData>


interface Summary {
    recieved: SummaryByDestination,
    created: SummaryByDestination,
    sended: SummaryByDestination,
}



type SummaryByType = Map<string, Summary>
type SummaryByLocation = Map<string, SummaryByType>

export default function LocationSummary() {


    const [dateRange, setDateRange] = useState<DateRange | undefined | null>()
    const { data } = useQuery(GET_SHIPPINGS)
    const [summary, setSummary] = useState<Map<string, Map<string, Summary>> | undefined>()


    const dateInRange = (dateString: string | undefined, range: DateRange) => {
        const date = dateString ? new Date(dateString) : undefined
        return date && date.valueOf() >= range[0].valueOf() && date.valueOf() <= range[1].valueOf()
    }



    const addShippingToSummary = (summaryByLocation: SummaryByLocation, shipping: Shipping, type: 'recieved' | 'created' | 'sended') => {

        let location: string
        let destination: string

        if (type === 'created' || type === 'sended') {
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

        if (!summary[type].has(destination)) {
            summary[type].set(destination, { count: 0, shippings: [] })
        }

        const summaryByDestination = summary[type].get(destination) as SummaryData

        summaryByDestination.count = summaryByDestination.count + shipping.count
        summaryByDestination.shippings.push(shipping)

    }


    const getSummary = (summary: Summary, type: keyof Summary) => {

        const formatDestination = (x: string) => {
            const parts = x.split(' — ')
            return parts[parts.length - 1]
        }

        const buildString = (type: keyof Summary, destination: string, count: number) => {
            return type === 'recieved'
                ? `${formatDestination(destination)} → ${count}`
                : `${count} → ${formatDestination(destination)}`
        }

        const result = Array.from(summary[type].entries())
            .map(([destination, x]) => buildString(type, destination, x.count))
            .map((x, i) => <div key={i}>{x}</div>)


        return result.length > 0 ? result : 0
    }


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
    }, [dateRange])

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
                    <DateRangePicker
                        placeholder={'Выберите период'}
                        showOneCalendar={true}
                        value={dateRange}
                        onChange={setDateRange}
                        format="dd-MM-yyyy"
                    ></DateRangePicker>

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
                                                <tr key={type} className="align-middle" >
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
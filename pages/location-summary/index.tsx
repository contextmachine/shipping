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

interface Summary {
    recieved: number,
    created: number,
    sended: number,
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

        const location = type === 'created' || type === 'sended' ? shipping.from : shipping.to

        if (!summaryByLocation.has(location)) {
            summaryByLocation.set(location, new Map<string, Summary>())
        }

        const summaryByType = summaryByLocation.get(location) as SummaryByType

        if (!summaryByType.has(shipping.contentType)) {
            summaryByType.set(shipping.contentType, { recieved: 0, created: 0, sended: 0 })
        }
        const summary = summaryByType.get(shipping.contentType) as Summary

        switch (type) {
            case 'recieved':
                summary.recieved = summary.recieved + shipping.count
                break
            case 'created':
                summary.created = summary.created + shipping.count
                break
            case 'sended':
                summary.sended = summary.sended + shipping.count
                break
        }
    }


    useEffect(() => {
        if (dateRange && data) {
            const shippingList = parseShippings(data)

            const summary = new Map<string, Map<string, Summary>>()

            shippingList.forEach(shipping => {
                if (dateInRange(shipping.recievedAt, dateRange)) {
                    console.log(shipping.to)
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
                                                    <td width="110">{summary.recieved}</td>
                                                    <td width="110">{summary.created}</td>
                                                    <td width="110">{summary.sended}</td>
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
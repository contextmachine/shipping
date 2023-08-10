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

export default function LocationSummary() {


    const [dateRange, setDateRange] = useState<DateRange | undefined | null>()
    const { data } = useQuery(GET_SHIPPINGS)
    const [summary, setSummary] = useState<Map<string, Map<string, Summary>> | undefined>()


    const dateInRange = (dateString: string | undefined, range: DateRange) => {

        const date = dateString ? new Date(dateString) : undefined
        return date && date.valueOf() >= range[0].valueOf() && date.valueOf() <= range[1].valueOf()

    }


    useEffect(() => {
        if (dateRange && data) {
            const shippingList = parseShippings(data)

            const shippingsInRange = shippingList.filter(x => {
                const createdIn = dateInRange(x.createdAt, dateRange)
                const recievedIn = dateInRange(x.recievedAt, dateRange)
                const sendedIn = dateInRange(x.sendedAt, dateRange)

                return createdIn || recievedIn || sendedIn
            })

            const getters = (shipping: Shipping) => {
                const getters = []
                if (shipping.recievedAt) {
                    getters.push((x: Shipping) => x.to)
                }
                if (shipping.createdAt) {
                    getters.push((x: Shipping) => x.from)
                }
                if (shipping.sendedAt) {
                    getters.push((x: Shipping) => x.from)
                }

                return getters
            }

            const groupedByLocation = groupByMultipleKeys(shippingsInRange, x => getters(x))

            const summaryMapByLocation = new Map(Array.from(groupedByLocation.entries()).map(([location, shippings]) => {

                const groupedByContentType = groupByOneKey(shippings, x => x.contentType)

                const summaryMapByType = new Map(Array.from(groupedByContentType).map(([contentType, shippings]) => {
                    const recieved = shippings
                        .filter(x => x.recievedAt)
                        .map(x => x.count)
                        .reduce((a, c) => {
                            return a + c
                        })
                    const created = shippings
                        .filter(x => x.createdAt)
                        .map(x => x.count)
                        .reduce((a, c) => {
                            return a + c
                        })
                    const sended = shippings
                        .filter(x => x.sendedAt)
                        .map(x => x.count)
                        .reduce((a, c) => {
                            return a + c
                        })
                    return [contentType, { recieved, created, sended }]
                }))

                return [location, summaryMapByType]
            }))

            setSummary(summaryMapByLocation)
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
                                    {Array.from(types.entries()).map(([type, summary]) => {
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
import { _Head } from "@/components"
import { Header } from "@/components/Header"
import { useEffect, useState } from 'react';
import { useQuery } from "@apollo/client";
import { GET_SHIPPINGS } from "@/graphql/queries";
import { parseShippings } from "@/graphql/parsers/parsers";
import { dateInRange } from "@/utils";
import { DateRange } from "@/utils/types";
import { addShippingToSummary, getSummary, Summary } from "./utils";
import DateRangePickerComponent from "@/components/DateRangePicker";
import Link from "next/link"
import 'rsuite/dist/rsuite-no-reset.min.css';

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
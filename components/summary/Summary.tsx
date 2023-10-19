import { _Head } from "@/components"
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from "@apollo/client";
import { GET_SHIPPINGS } from "@/graphql/queries";
import { parseShippings } from "@/graphql/parsers/parsers";
import { dateInRange } from "@/utils";
import { DateRange } from "@/utils/types";
import DateRangePickerComponent from "@/components/DateRangePicker";
import { Shipping } from "@/interfaces/Shipping";
import { User } from "@/interfaces/UserInterface";
import { useRouter } from "next/router";
import { Table } from "antd";
import { Summary, SummaryByLocation, SummaryByType, summaryColumns, SummaryData, SummaryDataType } from "./summary-columns";


export default function LocationSummary() {

    const [dateRange, setDateRange] = useState<DateRange | undefined | null>()
    const { data } = useQuery(GET_SHIPPINGS)
    const [summary, setSummary] = useState<Map<string, Map<string, Summary>> | undefined>()
    const router = useRouter()

    const tableData: Map<string, SummaryDataType[]> = useMemo(() => {

        const tables = new Map<string, SummaryDataType[]>()

        if (!summary) return tables

        Array.from(summary.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([location, types]) => {
                const rows: SummaryDataType[] = [...types].map(([type, summaryByDestination]) => {
                    return {
                        key: type,
                        content: type,
                        recieved: summaryByDestination.recieved,
                        created: summaryByDestination.created,
                        sended: summaryByDestination.sended
                    }
                })
                tables.set(location, rows)
            })

        return tables

    }, [summary])


    useEffect(() => {
        const user = (JSON.parse(localStorage.getItem('user') as string) as User)
        const allowed = user?.role === 'admin' || user?.login === 'lahta'

        if (!allowed) {
            router.push('/')
        }
    }, [router])

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
        } else if (!dateRange) {
            setSummary(undefined)
        }
    }, [data, dateRange])

    return <>
        <div className="d-flex flex-row mt-3">
            <DateRangePickerComponent dateRange={dateRange} setDateRange={setDateRange} />
        </div>
        <br />

        {tableData && [...tableData].map(([location, data], i) => (
            <div key={i}>
                <Table
                    title={() => <b>{location}</b>}
                    bordered
                    pagination={false}
                    tableLayout='fixed'
                    columns={summaryColumns}
                    dataSource={data}
                    size='small'
                />
                <br />
            </div>
        ))}
    </>
}


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
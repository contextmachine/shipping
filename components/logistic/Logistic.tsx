import { parseShippings } from "@/graphql/parsers/parsers"
import { GET_SHIPPINGS } from "@/graphql/queries"
import { User } from "@/interfaces/UserInterface"
import { dateInRange, groupByOneKey } from "@/utils"
import { DateRange } from "@/utils/types"
import { useQuery } from "@apollo/client"
import { Table } from "antd"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import DateRangePickerComponent from "../DateRangePicker"
import { logisticColumns, LogisticDataType, logisticStatusFilters, ShippingByStatus } from "./logistic-columns"

const initialValue = () => ({
    created: [],
    sended: [],
    recieved: []
})

export const Logistic = (): JSX.Element => {

    const router = useRouter()
    const [dateRange, setDateRange] = useState<DateRange | undefined | null>()
    const [tableData, setTableData] = useState<LogisticDataType[]>([])


    useEffect(() => {
        const user = (JSON.parse(localStorage.getItem('user') as string) as User)
        const allowed = user?.role === 'admin' || user?.login === 'lahta'

        if (!allowed) {
            router.push('/')
        }
    }, [router])

    const { data } = useQuery(GET_SHIPPINGS)


    useEffect(() => {
        if (dateRange && data) {

            const shippingList = parseShippings(data).filter(x =>
                (x.status === 'created' && dateInRange(x.createdAt, dateRange)) ||
                (x.status === 'sended' && dateInRange(x.sendedAt, dateRange)) ||
                (x.status === 'recieved' && dateInRange(x.recievedAt, dateRange))
            )

            const groupByType = groupByOneKey(shippingList, x => x.contentType)

            const tableData: LogisticDataType[] = [...groupByType.entries()].map(([type, shippings]) => {
                const row: LogisticDataType = {
                    contentType: type,
                    key: type,
                    expand: false,
                    push2hot: initialValue(),
                    hot2lahta: initialValue(),
                    hot2frez: initialValue(),
                    frez2hot: initialValue(),
                }

                shippings.forEach(shipping => {
                    for (const statusFilter of logisticStatusFilters) {
                        if (statusFilter.filter(shipping)) {
                            if (shipping.status === 'created') {
                                (row[statusFilter.key as keyof LogisticDataType] as ShippingByStatus).created.push(shipping)
                            } else if (shipping.status === 'sended') {
                                (row[statusFilter.key as keyof LogisticDataType] as ShippingByStatus).sended.push(shipping)
                            } else if (shipping.status === 'recieved') {
                                (row[statusFilter.key as keyof LogisticDataType] as ShippingByStatus).recieved.push(shipping)
                            }
                            break
                        }
                    }
                })

                return row
            })

            console.log(tableData)

            setTableData(tableData.sort((a, b) => a.contentType.localeCompare(b.contentType)))
        }
    }, [data, dateRange])


    return <>
        <div className="d-flex flex-row mt-3">
            <DateRangePickerComponent dateRange={dateRange} setDateRange={setDateRange} />
        </div>
        <br />
        <Table
            bordered
            pagination={false}
            tableLayout='fixed'
            columns={logisticColumns}
            dataSource={tableData}
            size='small'
            onRow={(data, index) => {
                return {
                    onClick: () => {
                        const x = tableData
                        tableData[index!].expand = !tableData[index!].expand
                        setTableData(x.slice())
                        console.log(tableData)
                    }
                }
            }}
        />
        <br />

    </>
}
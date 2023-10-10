import { Shipping } from "@/interfaces/Shipping"
import { Button, Col, Row } from "antd"
import { useEffect, useState } from "react"
import { ColumnFilter as ShippingFilter } from "./ColumnFilter"
import { initialColumns, spans } from "../Columns"
import DateFilter from "./DateFilter"
import { SearchId } from "./Search"
import { CloseCircleFilled } from "@ant-design/icons"
import { UserFilter } from "./UserFilter"
import { UserFilterFunction } from "@/utils/filterUtils"
import { User } from "@/interfaces/UserInterface"

export type TableFilterMap = Map<string, any>

export type Filters = Map<string, ShippingFilter[] | undefined>



interface TableFiltersProps {
    user: User
    shippings: Shipping[],
    setFiltered: (shippings: Shipping[]) => void
}

export function TableFilters(props: TableFiltersProps) {

    const { shippings, setFiltered, user } = props

    const [hasColumnFilter, setHasColumnFilter] = useState(false)

    const [userFilters, setUserFilters] = useState<UserFilterFunction[]>([])
    const [searchId, setSearchId] = useState<number | undefined>(undefined)
    const [filters, setFilters] = useState<Filters>(new Map(initialColumns.map((x) => ([x.key! as string, undefined]))))

    useEffect(() => {
        let filtered = shippings;

        userFilters.forEach((f) => {
            filtered = filtered.filter(shipping => f(shipping, user.id!))
        })

        const allFilters = [...filters.values()].flatMap(x => x ? x : []);

        if (allFilters.length > 0) {
            setHasColumnFilter(true)
        } else {
            setHasColumnFilter(false)
        }

        [...filters.values()].forEach((columnFilters) => {
            if (columnFilters && columnFilters.length > 0) {
                filtered = filtered.filter(shipping => {
                    return columnFilters.map(filter => filter(shipping)).reduce((a, c) => a || c, false)
                })
            }
        })
        setFiltered(filtered)
    }, [shippings, filters, setFiltered, userFilters])


    useEffect(() => {
        let filtered = shippings;

        if (searchId) {
            filtered = shippings.filter(shipping =>
                shipping.number.toString().startsWith(searchId.toString())
            )
        }
        setFiltered(filtered)
    }, [searchId, setFiltered, shippings])


    const clearColumnFilters = () => {
        setFilters(new Map(initialColumns.map((x) => ([x.key! as string, undefined]))))
    }


    return <>
        {user.role !== 'admin' && <UserFilter
            userFilters={userFilters}
            setUserFilters={setUserFilters}
        />}

        <Row>
            <Col span={spans[0]}>
                {!hasColumnFilter && <SearchId
                    searchId={searchId} setSearchId={setSearchId}
                />}
                {hasColumnFilter && <Button
                    onClick={clearColumnFilters}
                    style={{ color: 'gray' }}
                    color='secondary'
                    type="dashed"
                    size='small'
                    icon={<CloseCircleFilled />}>
                    Сбросить
                </Button>}
            </Col>
            <Col span={spans[1]}>
                <ShippingFilter
                    columnKey={'status'} shippings={shippings} filters={filters} setFilters={setFilters}
                />
            </Col>
            <Col span={spans[2]}>
                <ShippingFilter
                    columnKey={'contentType'} shippings={shippings} filters={filters} setFilters={setFilters}
                />
            </Col>
            <Col span={spans[3]}>

            </Col>
            <Col span={spans[4]}>
                <ShippingFilter
                    columnKey={'from'} shippings={shippings} filters={filters} setFilters={setFilters}
                />
            </Col>
            <Col span={spans[5]}>
                <ShippingFilter
                    columnKey={'to'} shippings={shippings} filters={filters} setFilters={setFilters}
                />
            </Col>
            <Col span={spans[6]}>
                <DateFilter
                    columnKey={'createdAt'} filters={filters} setFilters={setFilters}
                />
            </Col>
            <Col span={spans[7]}>
                <DateFilter
                    columnKey={'sendedAt'} filters={filters} setFilters={setFilters}
                />
            </Col>
            <Col span={spans[8]}>
                <DateFilter
                    columnKey={'recievedAt'} filters={filters} setFilters={setFilters}
                />
            </Col>
        </Row>
    </>

}
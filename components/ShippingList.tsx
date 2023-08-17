import ShippingItem from "@/components/ShippingItem";
import { dateInRange, paginate } from "@/utils";
import { filterShippings } from "@/utils/filterUtils";
import { dateComapare, sortShippings, statusSortValueMap } from "@/utils/sortUtils";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { Pagination } from "../interfaces/PaginationInterface";
import { Shipping } from "../interfaces/Shipping";
import { AlertType } from "./Alert";
import { ColumnFilter } from "./ColumnFilter";
import DateFilter from "./DateFilter";
import SortButton, { SortValue } from "./SortButton";
import { statusMap } from "./Status";

export interface ShippingListProps {
    shippings: Shipping[],
    user: string,
    isAdmin: boolean,
    page: number,
    limit: number,
    userFilter: string,
    loading: boolean,
    searchId: number
}

export interface TableFilter {
    field: string,
    value: any
}

export interface SortState {
    field: string,
    value: SortValue
}


export default function ShippingList(props: ShippingListProps) {

    const { shippings, isAdmin, page, limit, userFilter, loading, searchId } = props
    const router = useRouter()
    const [alert, setAlert] = useState<AlertType>()
    const [columnFilter, setColumnFilter] = useState<TableFilter>({ field: 'none', value: 'none' })
    const [sortState, setSortState] = useState<SortState>({ field: 'id', value: 'ascending' })
    const [pagination, setPagination] = useState<Pagination | null>()

    const [filteredList, setFilteredList] = useState<Shipping[]>([])
    const [sortedList, setSortedList] = useState<Shipping[]>([])

    const statusParams = Array.from(new Set(shippings.map(x => x.status)).values())
        .map(x => ({ value: x, label: statusMap.get(x) as string }))
    const contentParams = Array.from(new Set(shippings.map(x => x.contentType)).values())
        .map(x => ({ value: x, label: x }))
    const toParams = Array.from(new Set(shippings.map(x => x.to)).values())
        .map(x => ({ value: x, label: x }))
    const fromParams = Array.from(new Set(shippings.map(x => x.from)).values())
        .map(x => ({ value: x, label: x }))

    useEffect(() => {
        setColumnFilter({ field: 'none', value: 'none' })
    }, [userFilter, searchId])


    useEffect(() => {
        const sorted = sortShippings(shippings, sortState)
        if (sortState.value === 'descending') {
            sorted.reverse()
        }
        setSortedList(sorted.slice())
    }, [sortState, shippings])

    useEffect(() => {
        let filtered: Shipping[]
        if (columnFilter.value === 'none' || columnFilter.value === null) {
            filtered = sortedList
        } else {
            filtered = filterShippings(sortedList, columnFilter)
        }
        setFilteredList(filtered)
    }, [columnFilter, columnFilter.field, columnFilter.value, sortedList])


    useEffect(() => {
        const pagination = paginate(filteredList as [], page, limit) as Pagination
        setPagination(pagination)
    }, [filteredList, limit, page])

    return <>

        {pagination && <>
            <table className="table table-striped table-sm text-center">
                <thead>
                    <tr className="justify-content-center">
                        <th scope="col">
                            ID
                            <SortButton field='id' sortState={sortState} setSortState={setSortState} />
                        </th>
                        <th scope="col">
                            <ColumnFilter field='status' params={statusParams} columnFilter={columnFilter} setColumnFilter={setColumnFilter} />
                            Статус
                            <SortButton field='status' sortState={sortState} setSortState={setSortState} />
                        </th>
                        <th scope="col">
                            <ColumnFilter field='contentType' params={contentParams} columnFilter={columnFilter} setColumnFilter={setColumnFilter} />
                            Контент
                            <SortButton field='contentType' sortState={sortState} setSortState={setSortState} />
                        </th>
                        <th scope="col">
                            Кол-во
                            <SortButton field='count' sortState={sortState} setSortState={setSortState} />
                        </th>
                        <th scope="col">
                            <ColumnFilter field='from' params={fromParams} columnFilter={columnFilter} setColumnFilter={setColumnFilter} />
                            Откуда
                            <SortButton field='from' sortState={sortState} setSortState={setSortState} />
                        </th>
                        <th scope="col">
                            <ColumnFilter field='to' params={toParams} columnFilter={columnFilter} setColumnFilter={setColumnFilter} />
                            Куда
                            <SortButton field='to' sortState={sortState} setSortState={setSortState} />
                        </th>
                        <th scope="col">
                            <DateFilter field='created' columnFilter={columnFilter} setColumnFilter={setColumnFilter} />
                            Создан
                            <SortButton field='created' sortState={sortState} setSortState={setSortState} />
                        </th>
                        <th scope="col">
                            <DateFilter field='sended' columnFilter={columnFilter} setColumnFilter={setColumnFilter} />
                            Отправлен
                            <SortButton field='sended' sortState={sortState} setSortState={setSortState} />
                        </th>
                        <th scope="col">
                            <DateFilter field='recieved' columnFilter={columnFilter} setColumnFilter={setColumnFilter} />
                            Получен
                            <SortButton field='recieved' sortState={sortState} setSortState={setSortState} />
                        </th>
                        {isAdmin && <th scope="col"></th>}
                    </tr>
                </thead>

                <tbody>
                    {pagination.items.map((post: Shipping, i: number) => (
                        <ShippingItem key={i} index={i} shipping={post} setAlert={setAlert} admin={isAdmin} />
                    ))}
                </tbody>
            </table>
            {loading && <div className="spinner-border" role="status"></div>}

            <nav className="my-5">
                <ul className="pagination justify-content-center">
                    {page > 1 && <li className="page-item">
                        <button className="page-link text-primary" onClick={() => {
                            router.push(`?page=${page - 1}&limit=${limit}`)
                        }}>
                            <i className="bi bi-arrow-left"></i>
                        </button>
                    </li>}

                    {pagination.totalPages > 1 && <li className="page-item page-link text-primary">
                        Page {page}/{pagination.totalPages!}
                    </li>}

                    {page < pagination.totalPages && <li className="page-item">
                        <button className="page-link text-primary" onClick={() => {
                            router.push(`?page=${page + 1}&limit=${limit}`)
                        }}>
                            <i className="bi bi-arrow-right"></i>
                        </button>
                    </li>}
                </ul>
            </nav>
        </>
        }
    </>
}


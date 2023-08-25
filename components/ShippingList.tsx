import ShippingItem from "@/components/ShippingItem";
import { dateInRange, paginate } from "@/utils";
import { columnFilterMap } from "@/utils/filterUtils";
import { dateComapare, sortShippings, statusSortValueMap } from "@/utils/sortUtils";
import { Button, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { Pagination } from "../interfaces/PaginationInterface";
import { Shipping } from "../interfaces/Shipping";
import { AlertType } from "./Alert";
import { ColumnFilter } from "./ColumnFilter";
import DateFilter from "./DateFilter";
import SortButton, { SortValue } from "./SortButton";
import { statusMap } from "./Status";
import CloseIcon from '@mui/icons-material/Close';

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

export type TableFilters = Map<string, any>

export interface SortState {
    field: string,
    value: SortValue
}


export default function ShippingList(props: ShippingListProps) {

    const { shippings, isAdmin, page, limit, userFilter, loading, searchId } = props
    const router = useRouter()
    const [alert, setAlert] = useState<AlertType>()
    const [columnFilters, setColumnFilter] = useState<TableFilters>(new Map([...columnFilterMap].map(([field, _]) => ([field, 'none']))))
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
        resetFilters()
    }, [userFilter, searchId])


    const resetFilters = () => {
        setColumnFilter(new Map([...columnFilterMap].map(([field, _]) => ([field, 'none']))))
    }


    useEffect(() => {
        const sorted = sortShippings(shippings, sortState)
        if (sortState.value === 'descending') {
            sorted.reverse()
        }
        setSortedList(sorted.slice())
    }, [sortState, shippings])

    useEffect(() => {
        let filtered: Shipping[]
        filtered = sortedList
        const filters = [...columnFilters]
        filters.forEach(([field, value]) => {
            if (value !== 'none') {
                const filter = columnFilterMap.get(field)!
                filtered = filter(filtered, value)
            }
        })
        setFilteredList(filtered)
    }, [columnFilters, sortedList])

    const disableReset = useMemo(() => {
        const disabled = ([...columnFilters]
            .map(([_, v]) => v === 'none' || v === undefined ? 0 : 1) as number[])
            .reduce((a, c) => a + c, 0) === 0
        return disabled
    }, [columnFilters])


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
                            <div className="d-flex flex-start mb-2" >
                                <IconButton
                                    size='small'
                                    disabled={disableReset}
                                    onClick={resetFilters}
                                    title='Очистить фильтры'
                                >
                                    <CloseIcon />
                                </IconButton>
                            </div>
                            <div className="d-flex flex-nowrap justify-content-center">
                                ID
                                <SortButton field='id' sortState={sortState} setSortState={setSortState} />
                            </div>

                        </th>
                        <th scope="col" >
                            <ColumnFilter field='status' params={statusParams} columnFilter={columnFilters} setColumnFilter={setColumnFilter} />
                            <div className="d-flex flex-nowrap justify-content-center">
                                Статус
                                <SortButton field='status' sortState={sortState} setSortState={setSortState} />
                            </div>
                        </th>
                        <th scope="col">
                            <ColumnFilter field='contentType' params={contentParams} columnFilter={columnFilters} setColumnFilter={setColumnFilter} />
                            <div className="d-flex flex-nowrap justify-content-center">
                                Контент
                                <SortButton field='contentType' sortState={sortState} setSortState={setSortState} />
                            </div>

                        </th>
                        <th scope="col">
                            <div className="d-flex flex-nowrap text-nowrap justify-content-center">
                                Кол-во
                                <SortButton field='count' sortState={sortState} setSortState={setSortState} />
                            </div>

                        </th>
                        <th scope="col">
                            <ColumnFilter field='from' params={fromParams} columnFilter={columnFilters} setColumnFilter={setColumnFilter} />
                            <div className="d-flex flex-nowrap justify-content-center">
                                Откуда
                                <SortButton field='from' sortState={sortState} setSortState={setSortState} />
                            </div>

                        </th>
                        <th scope="col">
                            <ColumnFilter field='to' params={toParams} columnFilter={columnFilters} setColumnFilter={setColumnFilter} />
                            <div className="d-flex flex-nowrap justify-content-center">
                                Куда
                                <SortButton field='to' sortState={sortState} setSortState={setSortState} />
                            </div>

                        </th>
                        <th scope="col">
                            <DateFilter field='createdAt' columnFilter={columnFilters} setColumnFilter={setColumnFilter} />
                            <div className="d-flex flex-nowrap justify-content-center">
                                Создан
                                <SortButton field='created' sortState={sortState} setSortState={setSortState} />
                            </div>

                        </th>
                        <th scope="col">
                            <DateFilter field='sendedAt' columnFilter={columnFilters} setColumnFilter={setColumnFilter} />
                            <div className="d-flex flex-nowrap justify-content-center">
                                Отправлен
                                <SortButton field='sended' sortState={sortState} setSortState={setSortState} />
                            </div>

                        </th>
                        <th scope="col">
                            <DateFilter field='recievedAt' columnFilter={columnFilters} setColumnFilter={setColumnFilter} />
                            <div className="d-flex flex-nowrap justify-content-center">
                                Получен
                                <SortButton field='recieved' sortState={sortState} setSortState={setSortState} />
                            </div>

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


import ShippingItem from "@/components/ShippingItem";
import { User } from "@/interfaces/UserInterface";
import { paginate } from "@/utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Pagination } from "../interfaces/PaginationInterface";
import { Shipping } from "../interfaces/Shipping";
import { AlertType } from "./Alert";
import { ColumnFilter } from "./ColumnFilter";


export interface ShippingListProps {
    shippings: Shipping[],
    user: string,
    isAdmin: boolean,
    page: number,
    limit: number,
    userFilter: string
}

export interface TableFilter {
    field: string,
    value: string
}


export default function ShippingList(props: ShippingListProps) {

    const { shippings, isAdmin, page, limit, userFilter } = props
    const router = useRouter()
    const [alert, setAlert] = useState<AlertType>()
    const [columnFilter, setColumnFilter] = useState<TableFilter>({ field: 'none', value: 'none' })
    const [shippingList, setShippingList] = useState<Pagination | null>(null)

    const statusList = Array.from(new Set(shippings.map(x => x.status)).values())
    const contentList = Array.from(new Set(shippings.map(x => x.contentType)).values())
    const toList = Array.from(new Set(shippings.map(x => x.to)).values())
    const fromList = Array.from(new Set(shippings.map(x => x.from)).values())

    useEffect(() => {
        setColumnFilter({ field: 'none', value: 'none' })
    }, [userFilter])

    useEffect(() => {
        let filtered: Shipping[]
        if (columnFilter.value === 'none') {
            filtered = shippings
        } else {
            switch (columnFilter.field) {
                case 'status':
                    filtered = shippings.filter(x => x.status === columnFilter.value)
                    break
                case 'contentType':
                    filtered = shippings.filter(x => x.contentType === columnFilter.value)
                    break
                case 'from':
                    filtered = shippings.filter(x => x.from === columnFilter.value)
                    break
                case 'to':
                    filtered = shippings.filter(x => x.to === columnFilter.value)
                    break
                default:
                    filtered = shippings
            }
        }

        setShippingList(paginate(filtered as [], page, limit) as Pagination)
    }, [columnFilter, limit, page, shippings])

    return <>

        <table className="table table-striped table-sm text-center">
            <thead>
                <tr className="justify-content-center">
                    <th scope="col">#</th>
                    <th className="" scope="col">
                        <ColumnFilter field={'status'} params={statusList} columnFilter={columnFilter} setColumnFilter={setColumnFilter} />
                        Статус
                    </th>
                    <th scope="col">
                        <ColumnFilter field={'contentType'} params={contentList} columnFilter={columnFilter} setColumnFilter={setColumnFilter} />
                        Контент
                    </th>
                    <th scope="col">Кол-во</th>
                    <th scope="col">
                        <ColumnFilter field={'from'} params={fromList} columnFilter={columnFilter} setColumnFilter={setColumnFilter} />
                        Откуда
                    </th>
                    <th scope="col">
                        <ColumnFilter field={'to'} params={toList} columnFilter={columnFilter} setColumnFilter={setColumnFilter} />
                        Куда
                    </th>
                    <th scope="col">Создан</th>
                    <th scope="col">Отправлен</th>
                    <th scope="col">Получен</th>
                    {isAdmin && <th scope="col"></th>}
                </tr>
            </thead>

            <tbody>
                {shippingList?.items?.map((post: Shipping, i: number) => (
                    <ShippingItem key={i} index={i} shipping={post} setAlert={setAlert} admin={isAdmin} />
                ))}
            </tbody>
        </table>

        <nav className="my-5">
            <ul className="pagination justify-content-center">
                {shippingList?.page! > 1 && <li className="page-item">
                    <button className="page-link text-primary" onClick={() => router.push(`?page=${shippingList?.page! - 1}&limit=${limit}`)}>
                        <i className="bi bi-arrow-left"></i>
                    </button>
                </li>}

                {shippingList?.totalPages! > 1 && <li className="page-item page-link text-primary">
                    Page {shippingList?.page!}/{shippingList?.totalPages!}
                </li>}

                {shippingList?.page! < shippingList?.totalPages! && <li className="page-item">
                    <button className="page-link text-primary" onClick={() => router.push(`?page=${shippingList?.page! + 1}&limit=${limit}`)}>
                        <i className="bi bi-arrow-right"></i>
                    </button>
                </li>}
            </ul>
        </nav>
    </>
}


import ShippingRow from "@/components/ShippingRow";
import { useRouter } from "next/router";
import { Pagination } from "../pages/api/app/interfaces/PaginationInterface";
import { Shipping } from "../pages/api/app/interfaces/Shipping";


export interface ShippingListProps {
    data: Pagination | undefined
    isAdmin: boolean,
    limit: number,
    setAlert: (e: any) => void
}


export default function ShippingList(props: ShippingListProps) {

    const { data, isAdmin, setAlert, limit } = props
    const router = useRouter()



    return <>
        <table className="table table-striped table-sm text-center">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">QR</th>
                    <th scope="col">Status</th>
                    <th scope="col">Types</th>
                    <th scope="col">Count</th>
                    <th scope="col">From</th>
                    <th scope="col">To</th>
                    <th scope="col">Created at</th>
                    <th scope="col">Sended at</th>
                    <th scope="col">Recieved at</th>
                    {isAdmin && <th scope="col"></th>}
                </tr>
            </thead>

            <tbody>
                {data?.items?.map((post: Shipping, i: number) => (
                    <ShippingRow key={i} index={i} shipping={post} setAlert={setAlert} admin={isAdmin} />
                ))}
            </tbody>
        </table>

        <nav className="my-5">
            <ul className="pagination justify-content-center">
                {data?.page! > 1 && <li className="page-item">
                    <button className="page-link text-primary" onClick={() => router.push(`?page=${data?.page! - 1}&limit=${limit}`)}>
                        <i className="bi bi-arrow-left"></i>
                    </button>
                </li>}

                {data?.totalPages! > 1 && <li className="page-item page-link text-primary">
                    Page {data?.page!}/{data?.totalPages!}
                </li>}

                {data?.page! < data?.totalPages! && <li className="page-item">
                    <button className="page-link text-primary" onClick={() => router.push(`?page=${data?.page! + 1}&limit=${limit}`)}>
                        <i className="bi bi-arrow-right"></i>
                    </button>
                </li>}
            </ul>
        </nav>
    </>
}



import { _Head, AlertType } from "@/components"
import { useRouter } from "next/router"
import Link from "next/link"
import { useEffect, useState } from "react"
import ShippingList from "../components/ShippingList"
import styles from "./index.module.scss"

import GET_SHIPPINGS from '@/graphql/queries/getShippings.gql'
import { useQuery } from "@apollo/client"
import { paginate } from "@/utils"
import { parseShippings } from "@/graphql/parsers/parsers"
import { Pagination } from "../interfaces/PaginationInterface"
import { User } from "../interfaces/UserInterface"

const initialStatuses = [{
    name: 'created',
    value: true,
    label: 'Created'
},
{
    name: 'sended',
    value: true,
    label: 'Sended'
},
{
    name: 'recieved',
    value: false,
    label: 'Recieved'
}]

export default function Home({ page, limit }: { page: number, limit: number }) {
    const router = useRouter()
    const [notAuth, setNotAuth] = useState<boolean>(false)
    const [alert, setAlert] = useState<AlertType>()
    const [isAdmin, setAdmin] = useState<boolean>(false)
    const [statuses, setStatuses] = useState(initialStatuses)
    const [statusFilter, setStatusFilter] = useState<string[]>(initialStatuses.map(x => x.name))

    console.log(statusFilter)
    const statusFilterHander = (pos: number) => {
        const updatedState = statuses.map((x, i) => {
            return i == pos ? { ...x, value: !x.value } : x
        })
        setStatuses(updatedState)
    }

    useEffect(() => {
        const list = statuses.filter(x => x.value).map(x => x.name)
        setStatusFilter(list.length !== 0 ? list : initialStatuses.map(x => x.name))
    }, [statuses])


    const { data: shippingsData } = useQuery(GET_SHIPPINGS, { variables: { status: statusFilter } })
    const shippings = parseShippings(shippingsData)
    const data = paginate(shippings as [], page, limit) as Pagination

    useEffect(() => {
        const user = (JSON.parse(localStorage.getItem('user') as string) as User)
        setAdmin(user?.role === 'admin')

        if (!localStorage.getItem('user')) {
            router.push('/login')
        }
    }, [router])

    return <>
        <_Head title="Shipping list" />

        <main className="shippingList container my-5">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h1>Shippings</h1>

                <div className="d-flex align-items-center">
                    <Link href="/posts/create" className="btn btn-primary mx-3" >
                        Create Shipping
                    </Link>

                    {notAuth && <Link href="/login" className="btn btn-primary">Log in</Link>}

                    {!notAuth && <div className="d-flex align-items-center">
                        <Link href="/logout" className="btn btn-danger">Log out</Link>
                    </div>}
                </div>
            </div>
            <div className={styles.buttonGroup + ' mb-4'}>
                <i className="bi bi-funnel-fill text-gray mx-3"></i>
                {statuses.map((status, i) => (
                    <div className={styles.checkBoxButton} title={status.name} key={i}>
                        <label>
                            <input type="checkbox" checked={status.value} onChange={() => statusFilterHander(i)} />
                            <span className={styles.btn}>{status.label}</span>
                        </label>
                    </div>

                ))}

            </div>
            <ShippingList data={data} isAdmin={isAdmin} setAlert={setAlert} limit={limit} />

        </main>
    </>
}

export async function getServerSideProps({ query: { page = 1, limit = 15 } }) {
    return {
        props: {
            page: page,
            limit: limit
        }
    }
}



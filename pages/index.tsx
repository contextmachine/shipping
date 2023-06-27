import { _Head, AlertType } from "@/components"
import { useRouter } from "next/router"
import Link from "next/link"
import { use, useEffect, useRef, useState } from "react"
import ShippingList from "../components/ShippingList"
import styles from "./index.module.scss"

import GET_SHIPPINGS from '@/graphql/queries/getShippings.gql'
import { useQuery } from "@apollo/client"
import { paginate } from "@/utils"
import { parseShippings } from "@/graphql/parsers/parsers"
import { Pagination } from "../interfaces/PaginationInterface"
import { User } from "../interfaces/UserInterface"
import { Header } from "@/components/Header"
import { Shipping } from "@/interfaces/Shipping"
import { FilterFunction, filterList, filterMap } from "@/utils/filterUtils"

export default function Home({ page, limit }: { page: number, limit: number }) {
    const router = useRouter()

    const [user, setUser] = useState<User>()
    const [isAdmin, setAdmin] = useState<boolean>(false)
    const userFilterSelect = useRef<HTMLSelectElement>(null)
    const [shippingList, setShippingList] = useState<Shipping[]>([])
    const [currentFilter, setCurrentFilter] = useState('all')
    const { data: shippingsData } = useQuery(GET_SHIPPINGS)

    useEffect(() => {
        if (user) {
            const filter = filterMap.get(currentFilter)
            if (filter) {
                const shippings = parseShippings(shippingsData)
                const filtered = shippings.filter(x => filter(x, user.id as string))
                setShippingList(filtered)
            }
        }
    }, [currentFilter, limit, page, shippingsData, user])

    const handleOnChange = () => {
        if (userFilterSelect.current) {
            setCurrentFilter(userFilterSelect.current.value)
        }
    }

    useEffect(() => {
        const user = (JSON.parse(localStorage.getItem('user') as string) as User)
        setAdmin(user?.role === 'admin')
        setUser(user)

        if (!localStorage.getItem('user')) {
            router.push('/login')
        }
    }, [router])


    return <>
        <_Head title="Список отправок" />

        <main className="container mt-3">
            <Header>
                <Link href="/posts/create" className="btn text-w btn-sm btn-primary mx-3 flex-nowrap" >
                    Создать отправку
                </Link>
                <Link href="/logout" className="btn btn-sm btn-danger align-middle">Выйти</Link>
            </Header>

            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <div className="input-group-text"><i className="bi bi-funnel-fill text-gray" /></div>
                </div>
                <select defaultValue="all" onChange={handleOnChange} ref={userFilterSelect} className="" style={{ width: '300px' }}>
                    {filterList.map(x => (<option key={x.value} value={x.value}>{x.label}</option>))}
                </select>
            </div>
            <ShippingList userFilter={currentFilter} shippings={shippingList} user={user?.id ? user.id : ''} isAdmin={isAdmin} page={page} limit={limit} />

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



import { _Head } from "@/components"
import { useRouter } from "next/router"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import ShippingList from "../components/ShippingList"
import { useQuery } from "@apollo/client"
import { parseShippings } from "@/graphql/parsers/parsers"
import { User } from "../interfaces/UserInterface"
import { Header } from "@/components/Header"
import { Shipping } from "@/interfaces/Shipping"
import { filterList, filterMap } from "@/utils/filterUtils"
import { GET_SHIPPINGS } from '@/graphql/queries'

export default function Home({ page, limit }: { page: number, limit: number }) {
    const router = useRouter()
    const [user, setUser] = useState<User>()
    const [isAdmin, setAdmin] = useState<boolean>(false)
    const [searchId, setSearchId] = useState<number>(NaN)
    const userFilterSelect = useRef<HTMLSelectElement>(null)
    const searchField = useRef<HTMLInputElement>(null)
    const [shippingList, setShippingList] = useState<Shipping[]>([])
    const [currentFilter, setCurrentFilter] = useState('all')

    const { data: shippingsData, loading: shippingListLoading } = useQuery(GET_SHIPPINGS)

    useEffect(() => {
        if (user) {
            const userFilter = filterMap.get(currentFilter)
            if (userFilter) {
                const shippings = parseShippings(shippingsData)

                let filtered: Shipping[]
                if (isAdmin) {
                    filtered = shippings.filter(x => userFilter(x, user.id as string))
                } else {
                    filtered = shippings
                        .filter(x => x.toId === user.id || x.fromId === user.id)
                        .filter(x => userFilter(x, user.id as string))
                }
                setShippingList(filtered)
            } else {
                setShippingList(parseShippings(shippingsData))
            }
        }
    }, [currentFilter, isAdmin, limit, page, searchId, shippingsData, user])


    useEffect(() => {
        const shippings = parseShippings(shippingsData)

        if (isNaN(searchId)) {
            if (searchField && searchField.current) {
                searchField.current.value = ''
            }
        } else {
            const filtered = shippings.filter(shipping =>
                shipping.number.toString().startsWith(searchId.toString())
            )
            setShippingList(filtered)
        }
    }, [searchId, shippingsData])

    const handleOnChangeFilter = () => {
        if (userFilterSelect.current) {
            setCurrentFilter(userFilterSelect.current.value)
            setSearchId(NaN)
        }
    }

    const handleSearch = () => {
        if (searchField.current) {
            const value = parseInt(searchField.current.value)
            setSearchId(value)
            setCurrentFilter('all')
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
                <Link href="/shippings/create" className="btn text-w btn-sm btn-primary mx-1 flex-nowrap" >
                    Создать отправку
                </Link>
                {isAdmin && <Link href="/users" className="btn text-w btn-sm btn-primary mx-1 flex-nowrap" >
                    Пользователи
                </Link>}
                <Link href="/logout" className="btn btn-sm btn-danger mx-1 align-middle">Выйти</Link>
            </Header>

            <div className="d-flex flex-row justify-content-start">
                <div className="d-inline-flex flex-column ">
                    <div className="d-flex flex-row ">

                        <div style={{ width: 220 }} >
                            <div className="input-group w-100 " >
                                <div className="input-group-text"><i className="bi bi-search text-gray" /></div>
                                <input placeholder="ID" type='number' onChange={handleSearch} ref={searchField} className="form-control" />
                            </div>
                        </div>
                        <div style={{ width: 10 }} />
                        <div style={{ width: 220 }}>
                            <div className="input-group w-100">
                                <div className="input-group-text"><i className="bi bi-funnel-fill text-gray" /></div>
                                <select value={currentFilter} defaultValue="all" onChange={handleOnChangeFilter} ref={userFilterSelect} className="form-control">
                                    {filterList.map(x => (<option key={x.value} value={x.value}>{x.label}</option>))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <ShippingList
                        searchId={searchId}
                        loading={shippingListLoading}
                        userFilter={currentFilter}
                        shippings={shippingList}
                        user={user?.id ? user.id : ''}
                        isAdmin={isAdmin}
                        page={page}
                        limit={limit} />
                </div>
            </div>
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


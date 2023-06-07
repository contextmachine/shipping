import { _Head, AlertType } from "@/components"
import { useRouter } from "next/router"
import useSWR from "swr"
import { Pagination, Shipping, User } from "@/pages/api/app/interfaces"
import Link from "next/link"
import { useEffect, useState } from "react"
import ShippingList from "../components/ShippingList"

export default function Home({ page, limit }: { page: number, limit: number }) {
    const router = useRouter()
    const [notAuth, setNotAuth] = useState<boolean>(false)
    const [alert, setAlert] = useState<AlertType>()
    const [isAdmin, setAdmin] = useState<boolean>(false)


    useEffect(() => {
        setNotAuth(!localStorage.getItem('token') as boolean)
        const user = (JSON.parse(localStorage.getItem('user') as string) as User)
        setAdmin(user?.role === 'admin')

        if (!localStorage.getItem('user')) {
            router.push('/login')
        }
    }, [router])

    const { data } = useSWR<Pagination>(`/api/posts?page=${page}&limit=${limit}`, async (url: string) => {
        return fetch(url).then(res => res.json())
    })

    return <>
        <_Head title="My Blog" />

        <main className="container my-5">
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

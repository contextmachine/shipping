import { _Head } from "@/components"
import ShippingCard from "@/components/ShippingCard"
import Status from "@/components/Status"
import { User } from "@/interfaces/UserInterface"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import { parseShipping } from "@/graphql/parsers/parsers"
import { Header } from "@/components/Header"
import { GET_SHIPPING, SEND, RECIEVE } from '@/graphql/queries'


export default function CurrentStatus() {

    const router = useRouter()
    const [user, setUser] = useState<User>()

    useEffect(() => {
        if (localStorage.getItem('user')) {
            const user = JSON.parse(localStorage.getItem('user') as string) as User
            setUser(user)
        } else {
            router.push('/login')
            setUser(undefined)
        }
    }, [router])

    const { data } = useQuery(GET_SHIPPING, { variables: { 'id': router.query.id } })
    const [send] = useMutation(SEND)
    const [recieve] = useMutation(RECIEVE)

    const shipping = parseShipping(data)

    const shippingUpdate = async () => {
        if (shipping && shipping.status !== 'recieved') {

            if (shipping.status === 'created') {
                await send({
                    variables: {
                        id: shipping.id,
                        sendedAt: new Date().toISOString(),
                        status: 'sended'
                    }
                })
            } else if (shipping.status === 'sended') {
                await recieve({
                    variables: {
                        id: shipping.id,
                        recievedAt: new Date().toISOString(),
                        status: 'recieved'
                    }
                })
            }
            router.reload()
        }

    }

    if (shipping) {
        return <>
            <_Head title={`Shipping Status | ${shipping?.id}`} />

            <main className="container mt-3" >
                <Header>
                    <Link href="/" className="btn btn-sm btn-primary">
                        Список отправок
                    </Link>
                </Header >
                <div className="d-flex justify-content-center">
                    <div className="d-flex flex-column" style={{ width: '380px' }}>
                        <ShippingCard shipping={shipping} showQr={false} />
                        <div className="mb-3 d-flex justify-content-evenly" >
                            <Status status={shipping.status} />
                        </div>
                        <div className="d-flex align-items-center">
                            {shipping.status === 'created'
                                && user?.id === shipping.fromId
                                && <button className='btn btn-primary w-100' onClick={shippingUpdate}>
                                    Отправить
                                </button>}
                            {shipping.status === 'sended'
                                && user?.id === shipping.toId
                                && <button className='btn btn-primary w-100' onClick={shippingUpdate}>
                                    Получить
                                </button>}
                        </div>
                    </div>
                </div>

            </main>
        </>
    } else {
        return <> </>
    }
}

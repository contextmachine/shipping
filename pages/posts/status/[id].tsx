import { _Head } from "@/components"
import ShippingCard from "@/components/ShippingCard"
import Status from "@/components/Status"
import { User } from "@/interfaces/UserInterface"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { SEND, RECIEVE } from '@/graphql/queries/updateStatus'
import GET_SHIPPING from '@/graphql/queries/getShipping.gql'
import { useMutation, useQuery } from "@apollo/client"
import { parseShipping } from "@/graphql/parsers/parsers"
import styles from '@/pages/index.module.scss'


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

            <main className="container my-5" style={{ width: '400px' }}>
                <div className="d-flex justify-content-end mb-5">
                    <Link href="/" className="btn btn-primary">
                        Go back
                    </Link>
                </div>
                <ShippingCard shipping={shipping} showQr={false} />
                <div className="mb-3 d-flex justify-content-evenly" >
                    <Status status={shipping.status} />
                </div>
                <div className="d-flex align-items-center">
                    {shipping.status === 'created'
                        && user?.id === shipping.fromId
                        && <button className={styles.updateStatusButton} title='send' onClick={shippingUpdate}>
                            Send
                        </button>}
                    {shipping.status === 'sended'
                        && user?.id === shipping.toId
                        && <button className={styles.updateStatusButton} title='recieve' onClick={shippingUpdate}>
                            Recieve
                        </button>}
                </div>
            </main>
        </>
    } else {
        return <> </>
    }
}

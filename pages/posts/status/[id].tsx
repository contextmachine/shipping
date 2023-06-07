import { _Head } from "@/components"
import ShippingCard from "@/components/ShippingCard"
import { User } from "@/pages/api/app/interfaces"
import { Shipping } from "@/pages/api/app/interfaces/Shipping"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import useSWR from 'swr'



export default function CurrentStatus() {

    const router = useRouter()
    const [user, setUser] = useState<User>()

    useEffect(() => {
        if (localStorage.getItem('user')) {
            const user = JSON.parse(localStorage.getItem('user') as string) as User
            setUser(user)
        } else {
            router.push('/login')
            setUser(null)
        }
    }, [router])

    const { data: shipping } = useSWR<Shipping>(`/api/posts/${router.query.id}`, async (url: string) => {
        return fetch(url).then(res => res.json())
    })

    const shippingUpdate = async () => {
        if (shipping && shipping.status !== 'recieved') {

            const updateBody = (shipping: Shipping) => {
                if (shipping.status === 'created') {
                    return {
                        'status': 'sended',
                        'sendedAt': new Date().toISOString()
                    }
                } else if (shipping.status === 'sended') {
                    return {
                        'status': 'recieved',
                        'recievedAt': new Date().toISOString()
                    }
                }
            }

            const res = await fetch(`/api/posts/${shipping.id}`, {
                method: 'put',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem('token') as string
                },
                body: JSON.stringify(updateBody(shipping))
            })
            router.reload()
        }

    }

    if (shipping) {
        return <>
            <_Head title={`Next.js Blog | ${shipping?.id}`} />

            <main className="container my-5" style={{ width: '400px' }}>
                <div className="d-flex justify-content-end mb-5">
                    <Link href="/" className="btn btn-primary">
                        Go back
                    </Link>
                </div>
                <ShippingCard shipping={shipping} showQr={false} />
                <div className="mb-3 d-flex justify-content-evenly" >
                    <div className='status' title={shipping.status} >
                        <p className='text-center mx-3 mb-0'>{shipping.status}</p>
                    </div>
                </div>
                <div className="d-flex align-items-center">
                    {shipping.status === 'created'
                        && user?.id === shipping.from
                        && <button className="btn w-100" title='send' onClick={shippingUpdate}>
                            Send
                        </button>}
                    {shipping.status === 'sended'
                        && user?.id === shipping.to
                        && <button className="btn w-100" title='recieve' onClick={shippingUpdate}>
                            Recieve
                        </button>}
                </div>
            </main>
        </>
    } else {
        return <> </>
    }
}
import { Shipping } from "@/pages/api/app/interfaces"
import { formatDate, getColorByStatus } from "@/utils"
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from "next/router"
import { FormEvent } from "react"
import useSWR from 'swr'


export interface ShippingItemProps {
    index: number,
    shipping: Shipping
    setAlert: (e: any) => void
    admin: boolean
}

export default function ShippingRow(props: ShippingItemProps) {

    const { shipping, index, setAlert, admin } = props
    const router = useRouter()

    const handleOnDelete = async (e: FormEvent<HTMLFormElement>, id: string) => {
        e.preventDefault()

        if (!confirm("Are you sure you want to delete this post ?")) { return }

        const res = await fetch(`/api/posts/${id}`, {
            method: 'delete',
            headers: { "Authorization": "Bearer " + localStorage.getItem('token') as string }
        })

        if (res.status === 200) {
            return router.reload()
        }

        setAlert({
            display: true,
            status: res.status,
            concern: 'post',
            action: 'delete'
        })
    }

    const { data: from } = useSWR<string>(`/api/location/${shipping?.from}`, async (url: string) => {
        return fetch(url).then(res => res.json())
    })
    const { data: to } = useSWR<string>(`/api/location/${shipping?.to}`, async (url: string) => {
        return fetch(url).then(res => res.json())
    })

    return <>
        <tr key={index} className="align-middle" >
            <th scope="row">{index + 1}</th>
            <td>
                <Link href={`/posts/${shipping.id}`} className="btn">
                    <Image src={`/upload/${shipping.qr}`} className="img-fluid" alt="Image de l'article" width="100" height="100" />
                </Link>
            </td>
            <td>
                <div className={`border border-opacity-0 bg-${getColorByStatus(shipping.status)} rounded-4 `} >
                    <p className='status' title={shipping.status} >{shipping.status}</p>
                </div>
            </td>

            <td>{shipping.contentType}</td>
            <td width="100">{shipping.count}</td>
            <td width="150">{from}</td>
            <td width="150">{to}</td>
            <td width="100">{formatDate(shipping.createdAt)}</td>
            <td width="100">{formatDate(shipping.sendedAt)}</td>
            <td width="100">{formatDate(shipping.recievedAt)}</td>
            {admin &&
                <td>
                    <div className="d-flex align-items-center">
                        <Link href={`/posts/edit/${shipping.id}`} className="mx-3" title="Edit">
                            <i className="bi bi-pencil-fill text-primary"></i>
                        </Link>

                        <form onSubmit={e => handleOnDelete(e, shipping.id as string)}>
                            <button type="submit" title="Delete" className="btn px-0 border-0">
                                <i className="bi bi-trash2-fill text-danger"></i>
                            </button>
                        </form>
                    </div>
                </td>
            }
        </tr>
    </>
}


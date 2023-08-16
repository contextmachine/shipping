import { Shipping } from "@/interfaces/Shipping"
import { formatDate } from "@/utils"
import { useMutation } from "@apollo/client"
import Link from 'next/link'
import { useRouter } from "next/router"
import { FormEvent } from "react"
import Status from "./Status"
import { GET_SHIPPINGS, DELETE_SHIPPING } from "@/graphql/queries"


export interface ShippingItemProps {
    index: number,
    shipping: Shipping
    setAlert: (e: any) => void
    admin: boolean
}

export default function ShippingItem(props: ShippingItemProps) {

    const { shipping, index, setAlert, admin } = props
    const router = useRouter()

    const [deleteShipping] = useMutation(DELETE_SHIPPING,
        { refetchQueries: [GET_SHIPPINGS] }
    )

    const handleOnDelete = async (e: FormEvent<HTMLFormElement>, id: string) => {
        e.preventDefault()

        if (!confirm("Are you sure you want to delete this post ?")) { return }

        await deleteShipping({
            variables: {
                id: id
            }
        })
    }

    return <>
        <tr key={index} className="align-middle" >
            <td width="80">{shipping.number}</td>
            <td width="90">
                <Link href={`/shippings/${shipping.id}`} className="btn" >
                    <Status status={shipping.status} />
                </Link>
            </td>
            <td width="140">{shipping.contentType}</td>
            <td width="100">{shipping.count}</td>
            <td width="150">{shipping.from}</td>
            <td width="150">{shipping.to}</td>
            <td width="130">{formatDate(shipping.createdAt)}</td>
            <td width="130">{formatDate(shipping.sendedAt)}</td>
            <td width="130">{formatDate(shipping.recievedAt)}</td>
            {admin &&
                <td>
                    <div className="d-flex align-items-center">
                        <Link href={`/shippings/edit/${shipping.id}`} className="mx-3" title="Edit">
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


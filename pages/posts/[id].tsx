import { _Head } from "@/components";
import { useRouter } from "next/router";
import Link from 'next/link'
import { saveSticker } from "@/utils";
import ShippingCard from "@/components/ShippingCard";
import GET_SHIPPING from '@/graphql/queries/getShipping.gql'
import { useQuery } from "@apollo/client";
import { parseShipping } from "@/graphql/parsers/parsers";



export default function PostDetails() {
    const { query } = useRouter()

    const { data } = useQuery(GET_SHIPPING, { variables: { 'id': query.id } })
    const shipping = parseShipping(data)

    if (shipping) {
        return <>
            <_Head title={`Shipping | ${shipping.id}`} />

            <main className="container my-5" style={{ width: '400px' }}>
                <div className="d-flex justify-content-end mb-5">
                    <Link href="/" className="btn btn-primary">
                        Go back
                    </Link>
                </div>
                <ShippingCard shipping={shipping} showQr={true} />
                <div className="mb-3 d-flex justify-content-evenly" >
                    <div className='status' title={shipping.status} >
                        <p className='text-center mx-3 mb-0'>{shipping.status}</p>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-1" onClick={() => saveSticker(shipping.id)}>Save</button>
                <div className="d-flex align-items-center">
                    <Link href={`/posts/status/${shipping.id}`} className="btn btn-secondary w-100">
                        Status
                    </Link>
                </div>
            </main>
        </>
    } else {
        return <> </>

    }
}





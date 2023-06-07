import { _Head } from "@/components";
import { useRouter } from "next/router";
import useSWR from 'swr'
import { Shipping } from "../api/app/interfaces"
import Image from 'next/image'
import Link from 'next/link'
import { formatDate, getColorByStatus, saveSticker } from "@/utils";
import html2canvas from "html2canvas";
import ShippingCard from "@/components/ShippingCard";




export default function PostDetails() {
    const { query } = useRouter()

    const { data: shipping } = useSWR<Shipping>(`/api/posts/${query.id}`, async (url: string) => {
        return fetch(url).then(res => res.json())
    })

    if (shipping) {
        return <>
            <_Head title={`Next.js Blog | ${shipping?.id}`} />

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



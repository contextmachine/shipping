import { _Head } from "@/components";
import { useRouter } from "next/router";
import Link from 'next/link'
import { saveSticker } from "@/utils";
import ShippingCard from "@/components/ShippingCard";
import { useQuery } from "@apollo/client";
import { parseShipping } from "@/graphql/parsers/parsers";
import Status from "@/components/Status";
import { Header } from "@/components/Header";
import { GET_SHIPPING } from '@/graphql/queries'

export default function PostDetails() {
    const { query } = useRouter()

    const { data } = useQuery(GET_SHIPPING, { variables: { 'id': query.id } })
    const shipping = parseShipping(data)

    if (shipping) {
        return <>
            <_Head title={`Shipping | ${shipping.id}`} />

            <main className="container mt-3" >
                <Header>
                    <Link href="/" className="btn btn-sm btn-primary">
                        Список отправок
                    </Link>
                </Header >
                <div className="d-flex justify-content-center">
                    <div className="d-flex flex-column align-itmes-center mb-5" style={{ maxWidth: '380px' }}>

                        <ShippingCard shipping={shipping} showQr={true} />
                        <div className="mb-3 d-flex justify-content-evenly" >
                            <Status status={shipping.status}></Status>
                        </div>
                        <button type="submit" className="btn btn-primary w-100 mb-1" onClick={() => saveSticker(shipping.id)}>Сохранить</button>
                        <div className="d-flex w-100 align-items-center">
                            <Link href={`/shippings/status/${shipping.id}`} className="btn btn-secondary w-100">
                                Статус (dev)
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    } else {
        return <> </>

    }
}





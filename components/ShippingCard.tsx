import { Shipping } from "@/pages/api/app/interfaces"
import { formatDate, makeQR } from "@/utils"
import Image from 'next/image'
import { useEffect, useState } from "react"

export interface ShippingCardProps {
    showQr: boolean,
    shipping: Shipping
}

const ShippingCard = (props: ShippingCardProps) => {

    const { showQr, shipping } = props
    const [qrUrl, setQrUrl] = useState('')

    useEffect(() => {
        if (shipping) {
            makeQR(shipping.id).then(setQrUrl)
        }
    }, [shipping])

    return <>
        <article id='sticker' className="card mb-2 d-flex flex-column">
            {showQr && <Image src={qrUrl} className="img-fluid" width="700" height="700" alt='qr-code' />}

            <div className="card-body d-flex flex-row justify-content-between mx-3">
                <h2 className="card-text">{shipping?.contentType}</h2>
                <h2 className="card-text">{shipping?.count + " pc."}</h2>
            </div>
            <div className="card-body d-flex flex-column justify-content-between">

                <dl className="row">
                    <dt className="col-sm-4 text-end">From:</dt>
                    <dd className="col-sm-8">{shipping.from}</dd>

                    <dt className="col-sm-4 text-end">To:</dt>
                    <dd className="col-sm-8">{shipping.to}</dd>

                    <dt className="col-sm-4 text-end">Created At:</dt>
                    <dd className="col-sm-8">{formatDate(shipping.createdAt)}</dd>
                </dl>
            </div>
            <p className="text-center">{shipping.id}</p>
        </article>
    </>
}

export default ShippingCard
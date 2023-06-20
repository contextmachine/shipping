import { Shipping } from "@/interfaces/Shipping"
import { formatDate, makeQR } from "@/utils"
import Image from 'next/image'
import { useEffect, useState } from "react"
import css from "./ShippingCard.module.scss"

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
        <article id='sticker' style={{ width: '380px', height: '570px' }} className={`card mb-2 d-flex flex-column`}>
            {showQr && <Image src={qrUrl} className="img-fluid" width="600" height="600" alt='qr-code' />}

            <div className="card-title my-1 d-flex flex-row justify-content-around">
                <h2 className="card-text">{shipping?.contentType}</h2>
                <h2 className="card-text">{shipping?.count + " pc."}</h2>
            </div>
            <div className="card-text d-flex flex-column justify-content-between">
                <dl className="row mb-3">
                    <dt className="col-sm-4 text-end">From:</dt>
                    <dd className="col-sm-8">{shipping.from}</dd>

                    <dt className="col-sm-4 text-end">To:</dt>
                    <dd className="col-sm-8">{shipping.to}</dd>

                    <dt className="col-sm-4 text-end">Created At:</dt>
                    <dd className="col-sm-8">{formatDate(shipping.createdAt)}</dd>
                    <p className="text-center mt-3">{shipping.id}</p>
                </dl>
            </div>
        </article>
    </>
}

export default ShippingCard
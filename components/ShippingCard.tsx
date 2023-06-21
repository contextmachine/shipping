import { Shipping } from "@/interfaces/Shipping"
import { formatDate, makeQR } from "@/utils"
import { fontStyle } from "html2canvas/dist/types/css/property-descriptors/font-style"
import { fontWeight } from "html2canvas/dist/types/css/property-descriptors/font-weight"
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
        <article id='sticker' style={{ width: '380px', height: `${showQr ? '570px' : 'auto'}` }} className={`card mb-2 d-flex flex-column`}>
            {showQr && <Image src={qrUrl} className="img-fluid" width="600" height="600" alt='qr-code' />}
            <div className="card-text d-flex flex-column justify-content-around">
                <div className="card-title d-flex flex-row justify-content-around">
                    <h2 className="card-text">{shipping?.contentType}</h2>
                    <h2 className="card-text">{shipping?.count + " pc."}</h2>
                </div>
                <div className="d-flex flex-row justify-content-between">
                    <p className="text-end m-0" style={{ width: '100px', fontWeight: 'bold' }}>From:</p>
                    <p className="m-0" style={{ width: '250px' }}>{shipping.from}</p>
                </div>
                <div className="d-flex flex-row justify-content-between">
                    <p className="text-end m-0" style={{ width: '100px', fontWeight: 'bold' }}>To:</p>
                    <p className="m-0" style={{ width: '250px' }}>{shipping.to}</p>
                </div>
                <div className="d-flex flex-row justify-content-between">
                    <p className="text-end m-0" style={{ width: '100px', fontWeight: 'bold' }}>CreatedAt:</p>
                    <p className="m-0" style={{ width: '250px' }}>{formatDate(shipping.createdAt)}</p>
                </div>
                <p className="text-center mt-3">{shipping.id}</p>

            </div>
        </article>
    </>
}

export default ShippingCard
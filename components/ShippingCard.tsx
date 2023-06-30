import { Shipping } from "@/interfaces/Shipping"
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
        <article id='sticker' style={{ width: '100%', height: `${showQr ? '570px' : 'auto'}` }} className={`card mb-2 d-flex flex-column`}>
            {showQr && <Image src={qrUrl} className="img-fluid" width="600" height="600" alt='qr-code' />}
            <div className="card-text d-flex flex-column justify-content-around">
                <div className="card-title d-flex flex-row justify-content-around align-items-baseline mt-1">
                    <h1 className="card-text">{shipping?.contentType}</h1>
                    <h2 className="card-text">{shipping?.count + " шт"}</h2>
                </div>
                <div className="d-flex flex-row justify-content-between">
                    <p className="text-end m-0" style={{ width: '100px', fontWeight: 'bold' }}>Откуда:</p>
                    <p className="m-0" style={{ width: '250px' }}>{shipping.from}</p>
                </div>
                <div className="d-flex flex-row justify-content-between">
                    <p className="text-end m-0" style={{ width: '100px', fontWeight: 'bold' }}>Куда:</p>
                    <p className="m-0" style={{ width: '250px' }}>{shipping.to}</p>
                </div>
                <div className="d-flex flex-row justify-content-between">
                    <p className="text-end m-0" style={{ width: '100px', fontWeight: 'bold' }}>Создан:</p>
                    <p className="m-0" style={{ width: '250px' }}>{formatDate(shipping.createdAt)}</p>
                </div>
                <p className="text-center mt-3">{shipping.number}</p>

            </div>
        </article>
    </>
}

export default ShippingCard
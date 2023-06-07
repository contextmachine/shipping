import { FormEvent, useState, useLayoutEffect, useRef, useEffect } from "react"
import Link from "next/link";
import { useRouter } from "next/router";
import { Alert, AlertType, _Head } from "@/components";
import QRCode from "qrcode"
import useSWR from 'swr'
import { uuid } from "uuidv4";
import { User } from "../api/app/interfaces";

export default function Create() {
    const router = useRouter()

    const [alert, setAlert] = useState<AlertType>()
    const [loading, showLoading] = useState<boolean>(false)
    const contentType = useRef<HTMLInputElement>(null)
    const count = useRef<HTMLInputElement>(null)
    const targetLocation = useRef<HTMLSelectElement>(null)

    useEffect(() => {
        if (!localStorage.getItem('user')) {
            router.push('/login')
        }
    })

    useLayoutEffect(() => {
        contentType.current?.focus()
    })

    const { data: places } = useSWR<{ name: string, id: string }[]>(`/api/location`, async (url: string) => {
        return fetch(url)
            .then(res => res.json())
    })

    const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        showLoading(true)

        const opts: QRCode.QRCodeToDataURLOptions = {
            errorCorrectionLevel: 'H',
            margin: 2,
        }

        const id = uuid()
        const qrUrl = await QRCode.toDataURL(`/status/${id}`, opts)
        const user = (JSON.parse(localStorage.getItem('user') as string) as User)


        const res = await fetch('/api/posts', {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('token') as string
            },
            body: JSON.stringify({
                "id": id,
                "contentType": contentType.current!.value,
                "count": parseInt(count.current!.value),
                "to": targetLocation.current!.value,
                "from": user.id,
                "qr": qrUrl,
                "status": 'created',
            })
        })
        console.log(res)


        if (res.status === 200) {
            const form = e.target as HTMLFormElement
            form.reset()


            router.push(`/posts/${id}`)
        }



        showLoading(false)
        setAlert({
            display: true,
            status: res.status,
            concern: 'post',
            action: 'create'
        })
    }

    return <>
        <_Head title="Create post" />


        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h1>Create Shipping</h1>

                <div className="d-flex align-items-center">
                    <Link href="/" className="btn btn-primary me-3">
                        Home
                    </Link>

                </div>
            </div>

            {alert && <Alert display={alert.display} status={alert.status} concern={alert.concern} action={alert.action} />}

            <div className="card shadow-sm">
                <div className="card-body">
                    <form onSubmit={handleOnSubmit}>

                        <datalist id="targetPlaces">
                            {places?.map((place, i) => (<option key={place.id} value={place.name} />))}
                        </datalist>

                        <div className="mb-3">
                            <label htmlFor="contentType" className="form-label">Content Type</label>
                            <input type="text" id="contentType" name="contentType" className="form-control" required ref={contentType} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="count" className="form-label">Count</label>
                            <input type="number" id="count" name="count" className="form-control" required ref={count}></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="targetLocation" className="form-label">Target Location</label>
                            <select id="targetLocation" name="targetLocation" className="form-control" required ref={targetLocation} defaultValue={'selectLocation'}>
                                <option value={'selectLocation'} disabled={true}>Select location</option>
                                {places?.map((place, i) => (<option key={place.id} value={place.id}>{place.name}</option>))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">
                            {loading && <div className="spinner-border spinner-border-sm me-1" role="status"></div>} Save
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </>
}



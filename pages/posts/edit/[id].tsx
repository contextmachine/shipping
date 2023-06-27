import { useRouter } from "next/router"
import { FormEvent, useState, useRef, ChangeEvent, useEffect } from "react"
import Link from "next/link";
import { Alert, AlertType, _Head } from "@/components";
import { User } from "@/interfaces/UserInterface";
import EDIT_SHIPPING from '@/graphql/queries/editShipping.gql'
import GET_PLACES from '@/graphql/queries/getPlaces.gql'
import GET_CONTENT_TYPES from '@/graphql/queries/getContentTypes.gql'
import GET_SHIPPING from '@/graphql/queries/getShipping.gql'
import GET_SHIPPINGS from '@/graphql/queries/getShippings.gql'
import { useMutation, useQuery } from "@apollo/client";
import { parseContentTypes, parseLocations, parseShipping } from "@/graphql/parsers/parsers";
import { uuid } from "uuidv4";
import { statusList } from "@/components/Status";




interface DateState {
    createdAt: string | null,
    sendedAt: string | null,
    recievedAt: string | null
}

export default function Edit() {
    const router = useRouter()

    const editForm = useRef<HTMLFormElement>(null)
    const [alert, setAlert] = useState<AlertType>()
    const [loading, showLoading] = useState<boolean>(false)
    const contentType = useRef<HTMLSelectElement>(null)
    const count = useRef<HTMLInputElement>(null)
    const targetLocation = useRef<HTMLSelectElement>(null)
    const sourceLocation = useRef<HTMLSelectElement>(null)
    const status = useRef<HTMLSelectElement>(null)
    const [dateState, setDateState] = useState<DateState | null>(null)

    const [editShipping] = useMutation(EDIT_SHIPPING, {
        onCompleted: () => {
            editForm.current?.reset()
            if (shipping) {
                router.push(`/posts/${shipping.id}`)
            }
        },
        refetchQueries: [GET_SHIPPING, GET_SHIPPINGS]
    })

    const places = parseLocations(useQuery(GET_PLACES).data)
    const contentTypes = parseContentTypes(useQuery(GET_CONTENT_TYPES).data)
    const { data } = useQuery(GET_SHIPPING, { variables: { 'id': router.query.id } })
    const shipping = parseShipping(data)

    useEffect(() => {
        if (!localStorage.getItem('user')) {
            router.push('/login')
        }

        const user: User = JSON.parse(localStorage.getItem('user') as string)

        if (user.role !== 'admin') {
            router.push('/')
        }
    })

    const onStatusChange = (status: string) => {
        if (shipping) {
            const newDate: DateState = {
                createdAt: null,
                sendedAt: null,
                recievedAt: null
            }
            if (status === 'created') {
                newDate.createdAt = new Date().toISOString()
                newDate.sendedAt = null
                newDate.recievedAt = null
            } else if (status === 'sended') {
                newDate.createdAt = shipping.createdAt ?? new Date().toISOString()
                newDate.sendedAt = new Date().toISOString()
                newDate.recievedAt = null
            } else {
                newDate.createdAt = shipping.createdAt
                newDate.sendedAt = shipping.sendedAt ?? new Date().toISOString()
                newDate.recievedAt = new Date().toISOString()
            }
            setDateState(newDate)
        }
    }

    const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {

        if (shipping) {
            e.preventDefault()
            showLoading(true)

            const variables = {
                id: shipping.id,
                count: parseInt(count.current!.value),
                content: contentType.current?.value,
                from: sourceLocation.current?.value,
                to: targetLocation.current?.value,
                status: status.current?.value,
                createdAt: dateState ? dateState.createdAt : shipping.createdAt,
                sendedAt: dateState ? dateState.sendedAt : shipping.sendedAt,
                recievedAt: dateState ? dateState.recievedAt : shipping.recievedAt,
            }

            await editShipping({ variables })
            showLoading(false)
        }
    }

    if (shipping) {

        return <>
            <_Head title="Edit shipping" />

            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h1>Редактировать отправку</h1>

                    <div className="d-flex align-items-center">
                        <Link href="/" className="btn btn-primary me-3">
                            Список отправок
                        </Link>
                    </div>
                </div>

                {alert && <Alert display={alert.display} status={alert.status} concern={alert.concern} action={alert.action} />}

                <div className="card shadow-sm">
                    <div className="card-body">
                        <form ref={editForm} onSubmit={handleOnSubmit}>
                            <div className="mb-3">
                                <label htmlFor="contentType" className="form-label">Контент</label>
                                <select id="contentType" name="contentType" className="form-control" required ref={contentType} defaultValue={shipping.contentType}>
                                    {contentTypes?.map((content, i) => (<option key={i} value={content}>{content}</option>))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="count" className="form-label">Количество</label>
                                <input type="number" id="count" name="count" className="form-control" required ref={count} defaultValue={shipping.count}></input>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="sourceLocation" className="form-label">Отправитель</label>
                                <select id="sourceLocation" name="sourceLocation" className="form-control" required ref={sourceLocation} defaultValue={shipping.fromId}>
                                    {places?.map((place, i) => (<option key={place.id} value={place.id}>{place.location}</option>))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="targetLocation" className="form-label">Получатель</label>
                                <select id="targetLocation" name="targetLocation" className="form-control" required ref={targetLocation} defaultValue={shipping.toId}>
                                    {places?.map((place, i) => (<option key={place.id} value={place.id}>{place.location}</option>))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="status" className="form-label" >Статус</label>
                                <select id="status" name="status" className="form-control" required ref={status} defaultValue={shipping.status} onChange={(e) => onStatusChange(e.target.value)}>
                                    {statusList.map((status, i) => (<option key={status.name} value={status.name}>{status.label}</option>))}
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                {loading && <div className="spinner-border spinner-border-sm me-1" role="status"></div>} Сохранить
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    } else {
        return <></>
    }

}

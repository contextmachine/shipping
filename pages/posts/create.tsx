import { FormEvent, useState, useLayoutEffect, useRef, useEffect } from "react"
import Link from "next/link";
import { useRouter } from "next/router";
import { Alert, AlertType, _Head } from "@/components";
import { uuid } from "uuidv4";
import { useMutation, useQuery } from "@apollo/client";
import ADD_SHIPPING from '@/graphql/queries/addShipping.gql'
import GET_PLACES from '@/graphql/queries/getPlaces.gql'
import GET_CONTENT_TYPES from '@/graphql/queries/getContentTypes.gql'
import { User } from "@/interfaces/UserInterface";
import { parseContentTypes, parseLocations } from "@/graphql/parsers/parsers";
import { Header } from "@/components/Header";

export default function Create() {
    const router = useRouter()
    const creationForm = useRef<HTMLFormElement>(null)
    const [alert, setAlert] = useState<AlertType>()
    const [loading, showLoading] = useState<boolean>(false)
    const contentType = useRef<HTMLSelectElement>(null)
    const count = useRef<HTMLInputElement>(null)
    const targetLocation = useRef<HTMLSelectElement>(null)

    const [addShipping] = useMutation(ADD_SHIPPING, {
        onCompleted: () => {
            creationForm.current?.reset()
        }
    })

    useEffect(() => {
        if (!localStorage.getItem('user')) {
            router.push('/login')
        }
    })

    useLayoutEffect(() => {
        contentType.current?.focus()
    })

    const places = parseLocations(useQuery(GET_PLACES).data)
    const contentTypes = parseContentTypes(useQuery(GET_CONTENT_TYPES).data)

    const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        showLoading(true)

        const id = uuid()
        const user = (JSON.parse(localStorage.getItem('user') as string) as User)

        await addShipping({
            variables: {
                id: id,
                from: user.id,
                createdAt: new Date().toISOString(),
                count: parseInt(count.current!.value),
                to: targetLocation.current?.value,
                content: contentType.current?.value,
            }
        })


        router.push(`/posts/${id}`)
        showLoading(false)

    }

    return <>
        <_Head title="Create shipping" />

        <div className="container mt-5">
            <Header>
                <div className="d-flex align-items-center">
                    <Link href="/" className="btn btn-primary me-3">
                        Список отправок
                    </Link>
                </div>

            </Header>
            <h4 className="my-3">Создать отправку</h4>

            {alert && <Alert display={alert.display} status={alert.status} concern={alert.concern} action={alert.action} />}

            <div className="card shadow-sm">
                <div className="card-body">
                    <form ref={creationForm} onSubmit={handleOnSubmit}>

                        <div className="mb-3">
                            <label htmlFor="contentType" className="form-label">Контент</label>
                            <select id="contentType" name="contentType" className="form-control" required ref={contentType} defaultValue={'selectContent'}>
                                <option value={'selectContent'} disabled={true}>Выберете контент</option>
                                {contentTypes?.map((content, i) => (<option key={i} value={content}>{content}</option>))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="count" className="form-label">Количество</label>
                            <input type="number" id="count" name="count" className="form-control" required ref={count}></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="targetLocation" className="form-label">Получатель</label>
                            <select id="targetLocation" name="targetLocation" className="form-control" required ref={targetLocation} defaultValue={'selectLocation'}>
                                <option value={'selectLocation'} disabled={true}>Выберете получателя</option>
                                {places.map((place, i) => (<option key={place.id} value={place.id}>{place.location}</option>))}
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
}




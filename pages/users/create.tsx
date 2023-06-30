import { Alert, AlertType } from "@/components";
import { Header } from "@/components/Header";
import client from "@/graphql/appolo-client";
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { GET_PLACES, GET_USERS } from "@/graphql/queries";
import { useRouter } from "next/router";


export default function CreateUser() {
    const router = useRouter()
    const creationForm = useRef<HTMLFormElement>(null)
    const [alert, setAlert] = useState<AlertType>()
    const [loading, showLoading] = useState<boolean>(false)

    const login = useRef<HTMLInputElement>(null)
    const name = useRef<HTMLInputElement>(null)
    const pass = useRef<HTMLInputElement>(null)

    const handleOnSubmit = async (e: FormEvent) => {
        e.preventDefault()
        showLoading(true)

        const res = await fetch('/api/createUser', {
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "login": login.current!.value,
                "name": name.current!.value,
                "password": pass.current!.value
            })

        })

        if (res.status === 200) {
            const data = await res.json()
            client.refetchQueries({ include: [GET_USERS, GET_PLACES] })
            router.push('/users')
        } else {
            setAlert({ display: true, status: res.status, concern: '', action: '' })
        }

        showLoading(false)
    }

    return <>
        <div className="container mt-3">
            <Header>
                <div className="d-flex flex-end">
                    <Link href="/users" className="btn btn-sm btn-primary">
                        Пользователи
                    </Link>
                </div>

            </Header>
            <h4 className="my-3">Создать Пользователя</h4>

            {alert && <Alert display={alert.display} status={alert.status} concern={alert.concern} action={alert.action} />}

            <div className="card shadow-sm">
                <div className="card-body">
                    <form ref={creationForm} onSubmit={(e) => handleOnSubmit(e)} autoComplete='off'>
                        <div className="mb-3">
                            <label htmlFor="login" className="form-label">Логин</label>
                            <input type="text" id="login" name="login" className="form-control" required ref={login} autoComplete='off'></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Имя</label>
                            <input type="text" id="name" name="name" className="form-control" required ref={name}></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="targetLocation" className="form-label">Пароль</label>
                            <input type="password" id="pass" name="pass" className="form-control" required ref={pass} autoComplete='new-password'></input>
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
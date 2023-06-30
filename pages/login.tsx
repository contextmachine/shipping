import { useRouter } from 'next/router'
import { FormEvent, useEffect, useLayoutEffect, useRef, useState } from "react"
import { _Head } from "@/components";

const Login = () => {
    const router = useRouter()

    const [loading, showLoading] = useState<boolean>(false)
    const [alert, showAlert] = useState<boolean>(false)
    const email = useRef<HTMLInputElement>(null)
    const password = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (localStorage.getItem('user')) {
            router.push('/')
        }
    })

    useLayoutEffect(() => {
        email.current?.focus()
    })

    const handleOnSubmit2 = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        showLoading(true)

        const res = await fetch('/api/auth', {
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "login": email.current!.value,
                "password": password.current!.value
            })
        })

        if (res.status === 200) {
            const data = await res.json()

            localStorage.setItem('user', JSON.stringify(data.user))
            localStorage.setItem('token', data.token)


        } else {
            showAlert(true)
        }

        showLoading(false)
    }

    return <>
        <_Head title="Log in" />

        <div className="container py-5" style={{ maxWidth: 380 }}>
            <h1 className="pb-4 text-center">Вход</h1>

            {alert && <div className="alert alert-danger">
                Неправильное имя или пароль
            </div>}

            <div className="card shadow p-4 mb-3">
                <form onSubmit={handleOnSubmit2}>
                    <div className="mb-3">
                        <label htmlFor="login" className="form-label">Логин</label>
                        <input type="text" id="login" name="login" className="form-control" required ref={email} />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="content" className="form-label">Пароль</label>
                        <input type="password" id="password" name="password" className="form-control" required ref={password} />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        {loading && <div className="spinner-border spinner-border-sm me-1" role="status"></div>} Войти
                    </button>
                </form>
            </div>
        </div>
    </>
}

export default Login
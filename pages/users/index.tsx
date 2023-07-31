import { User } from "@/interfaces/UserInterface"
import { useRouter } from "next/router"
import { FormEvent, useEffect } from "react"
import { DELETE_USER, GET_PLACES, GET_USERS } from '@/graphql/queries'
import { useMutation, useQuery } from "@apollo/client"
import { parseUsers } from "@/graphql/parsers/parsers"
import { Header } from "@/components/Header"
import Link from "next/link"
import client from "@/graphql/appolo-client";



export default function Users() {

    const router = useRouter()
    const { data } = useQuery(GET_USERS)
    const [deleteUser] = useMutation(DELETE_USER, { refetchQueries: [GET_USERS] })
    const users = parseUsers(data)


    useEffect(() => {
        if (!localStorage.getItem('user')) {
            router.push('/login')
        }

        const user: User = JSON.parse(localStorage.getItem('user') as string)

        if (user.role !== 'admin') {
            router.push('/')
        }
    })

    const handleOnDelete = async (e: FormEvent, id: string | undefined) => {
        e.preventDefault()

        if (id) {
            const res = await deleteUser({ variables: { id } })
            client.refetchQueries({ include: [GET_USERS, GET_PLACES] })
        }
    }

    return <>
        <div className="container mt-3">
            <Header>
                <Link href="/users/create" className="btn text-w btn-sm btn-primary mx-1 flex-nowrap" >
                    Создать Пользователя
                </Link>
                <Link href="/" className="btn text-w btn-sm btn-primary mx-1 flex-nowrap" >
                    Список Отправок
                </Link>
            </Header>
            <div className="d-flex flex-row justify-content-start">
                <div className="d-inline-flex ">
                    <table className="table table-striped table-sm text-center ">
                        <thead>
                            <tr className="justify-content-center">
                                <th className="" scope="col">Логин </th>
                                <th scope="col">Имя</th>
                                <th scope="col">Роль</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (<tr key={user.id} className="align-middle" >
                                <td width="150">{user.login}</td>
                                <td width="150">{user.location}</td>
                                <td width="150">{user.role}</td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <form onSubmit={e => handleOnDelete(e, user.id)}>
                                            <button type="submit" title="Delete" className="btn px-0 border-0">
                                                <i className="bi bi-trash2-fill text-danger"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>))}

                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </>
}
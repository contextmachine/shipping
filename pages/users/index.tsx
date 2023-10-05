import { FormEvent } from "react"
import { DELETE_USER, GET_PLACES, GET_USERS } from '@/graphql/queries'
import { useMutation, useQuery } from "@apollo/client"
import { parseUsers } from "@/graphql/parsers/parsers"
import client from "@/graphql/appolo-client";
import { Button, Card, Space } from "antd"
import { UserAddOutlined } from "@ant-design/icons"
import { useAdminOnly } from "@/components/hooks/useUser";


export default function Users() {
    
    useAdminOnly()
    const { data } = useQuery(GET_USERS)
    const [deleteUser] = useMutation(DELETE_USER, { refetchQueries: [GET_USERS] })
    const users = parseUsers(data)


    const handleOnDelete = async (e: FormEvent, id: string | undefined) => {
        e.preventDefault()

        if (id) {
            const res = await deleteUser({ variables: { id } })
            client.refetchQueries({ include: [GET_USERS, GET_PLACES] })
        }
    }

    return <>

        <main >

            <Space
                direction="vertical"
                align="center"
                style={{
                    width: '100%',
                }}
            >
                <Card
                    title='Список пользователей'
                    bordered={true}
                    style={{
                        width: '1280px',
                        margin: '50px',
                    }}
                    extra={<>
                        <Space.Compact                    >
                            <Button type='default' icon={<UserAddOutlined />} href="./users/create" >Добавить пользователя</Button>
                            <Button type='default' href="/" >Назад</Button>
                        </Space.Compact>
                    </>}

                >
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
                </Card>
            </Space>
        </main>
    </>
}
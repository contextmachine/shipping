import client from "@/graphql/appolo-client";
import { useState } from "react";
import { GET_PLACES, GET_USERS } from "@/graphql/queries";
import { useRouter } from "next/router";
import { Button, Card, Form, Input, Space } from "antd";
import { useAdminOnly, useLogin } from "@/components/hooks/useUser";

const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 14 } }

const buttonItemLayout = { wrapperCol: { span: 14, offset: 4 } }

export default function CreateUser() {

    useAdminOnly()
    const [form] = Form.useForm();
    const router = useRouter()
    const [loading, showLoading] = useState<boolean>(false)

    const handleOnSubmit = async (values: any) => {
        showLoading(true)

        const res = await fetch('/api/createUser', {
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "login": values.login,
                "name": values.name,
                "password": values.password
            })

        })

        if (res.status === 200) {
            const data = await res.json()
            client.refetchQueries({ include: [GET_USERS, GET_PLACES] })
            router.push('/users')
        } else {
        }

        showLoading(false)
    }

    return <>
        <Space
            direction="vertical"
            align="center"
            style={{
                width: '100%',
            }}
        >
            <Card
                title='Создать Пользователя'
                bordered={true}
                style={{
                    width: '1280px',
                    margin: '50px',
                }}
                extra={<>
                    <Space.Compact                    >
                        <Button type='default' href="/" >Назад</Button>
                    </Space.Compact>
                </>}

            >
                <Form
                    {...formItemLayout}
                    layout='horizontal'
                    form={form}
                    onFinish={(e) => handleOnSubmit(e)}
                >
                    <Form.Item
                        label='Login'
                        name="login"
                        rules={[{ required: true, message: 'Введите login!' }]}
                    >
                        <Input placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        label="Имя"
                        name='name'
                        rules={[{ required: true, message: 'Введите имя!' }]}
                    >
                        <Input placeholder="Имя" />
                    </Form.Item>
                    <Form.Item
                        label="Пароль"
                        name="password"
                        rules={[{ required: true, message: 'Введите пароль!' }]}
                    >
                        <Input
                            type="password"
                            placeholder="Пароль"
                        />
                    </Form.Item>

                    <Form.Item {...buttonItemLayout}>
                        <Button htmlType="submit" type="primary" loading={loading}>Создать</Button>
                    </Form.Item>
                </Form>
            </Card>
        </Space>


    </>
}
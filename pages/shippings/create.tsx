import { useState, useRef } from "react"
import { useRouter } from "next/router";
import { _Head } from "@/components";
import { uuid } from "uuidv4";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CONTENT_TYPES, ADD_SHIPPING, GET_PLACES, GET_SHIPPINGS } from "@/graphql/queries";
import { User } from "@/interfaces/UserInterface";
import { parseContentTypes, parseLocations } from "@/graphql/parsers/parsers";
import { Button, Card, Form, Input, Space, Select } from "antd";
import { useLogin } from "@/components/hooks/useUser";


const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 14 } }
const buttonItemLayout = { wrapperCol: { span: 14, offset: 4 } }



export default function Create() {
    useLogin()
    const router = useRouter()
    const creationForm = useRef<HTMLFormElement>(null)
    const [loading, showLoading] = useState<boolean>(false)

    const [form] = Form.useForm();


    const [addShipping] = useMutation(ADD_SHIPPING, {
        onCompleted: () => {
            creationForm.current?.reset()
        },
        refetchQueries: [GET_SHIPPINGS]
    })

    const places = parseLocations(useQuery(GET_PLACES).data)
    const contentTypes = parseContentTypes(useQuery(GET_CONTENT_TYPES).data)
        .sort((a, b) => {

            const aParts: string[] = a.split('-')
            const bParts: string[] = b.split('-')

            const alfabet = aParts[0].localeCompare(bParts[0])

            if (alfabet) {
                return alfabet
            } else {
                const aNum = aParts.length > 1 ? parseInt(aParts[aParts.length - 1]) : 0
                const bNum = bParts.length > 1 ? parseInt(bParts[bParts.length - 1]) : 0
                return aNum - bNum
            }

        })

    const handleOnSubmit = async (values: any) => {
        showLoading(true)

        const id = uuid()
        const user = (JSON.parse(localStorage.getItem('user') as string) as User)

        await addShipping({
            variables: {
                id: id,
                from: user.id,
                createdAt: new Date().toISOString(),
                count: parseInt(values.count),
                to: values.to,
                content: values.contentType,
            }
        })


        router.push(`/shippings/${id}`)
        showLoading(false)

    }

    return <>
        <_Head title="Create shipping" />

        <Space
            direction="vertical"
            align="center"
            style={{
                width: '100%',
            }}
        >
            <Card
                title='Создать отправку'
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
                        label='Контент'
                        name="contentType"
                        rules={[{ required: true, message: 'Выберете контент!' }]}
                    >
                        <Select
                            placeholder="Выберете контент"
                            options={contentTypes.map(x => ({ value: x, label: x }))}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Количество"
                        name='count'
                        rules={[{ required: true, message: 'Введите количество!' }]}
                    >
                        <Input placeholder="Количество" />
                    </Form.Item>
                    <Form.Item
                        label="Получатель"
                        name="to"
                        rules={[{ required: true, message: 'Выберете получателя!' }]}
                    >
                        <Select
                            placeholder="Выберете получателя"
                            options={places.map(x => ({ value: x.id, label: x.location }))}
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




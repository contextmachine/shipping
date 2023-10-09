import { useRouter } from "next/router"
import { FormEvent, useState, useRef, ChangeEvent, useEffect } from "react"
import Link from "next/link";
import { Alert, AlertType, _Head } from "@/components";
import { User } from "@/interfaces/UserInterface";
import { useMutation, useQuery } from "@apollo/client";
import { parseContentTypes, parseLocations, parseShipping } from "@/graphql/parsers/parsers";
import { statusList } from "@/components/Status";
import { EDIT_SHIPPING, GET_SHIPPING, GET_PLACES, GET_SHIPPINGS, GET_CONTENT_TYPES } from "@/graphql/queries"
import { Button, Card, Dropdown, Form, Input, MenuProps, Select, Space } from "antd"
import { useAdminOnly, useUser } from "@/components/hooks/useUser";


interface DateState {
    createdAt: Date | null,
    sendedAt: Date | null,
    recievedAt: Date | null
}

const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 14 } }
const buttonItemLayout = { wrapperCol: { span: 14, offset: 4 } }

export default function Edit() {

    useAdminOnly()
    const router = useRouter()
    const [loading, showLoading] = useState<boolean>(false)
    const [form] = Form.useForm();
    const [dateState, setDateState] = useState<DateState | null>(null)

    const [editShipping] = useMutation(EDIT_SHIPPING, {
        onCompleted: () => {
            form.resetFields()
            if (shipping) {
                router.push(`/shippings/${shipping.id}`)
            }
        },
        refetchQueries: [GET_SHIPPING, GET_SHIPPINGS]
    })

    const places = parseLocations(useQuery(GET_PLACES).data)
    const contentTypes = parseContentTypes(useQuery(GET_CONTENT_TYPES).data)
    const { data } = useQuery(GET_SHIPPING, { variables: { 'id': router.query.id } })
    const shipping = parseShipping(data)

    useEffect(() => {
        console.log(shipping)
    }, [shipping])

    const onStatusChange = (status: string) => {
        if (shipping) {
            const newDate: DateState = {
                createdAt: null,
                sendedAt: null,
                recievedAt: null
            }
            if (status === 'created') {
                newDate.createdAt = new Date()
                newDate.sendedAt = null
                newDate.recievedAt = null
            } else if (status === 'sended') {
                newDate.createdAt = shipping.createdAt ?? new Date()
                newDate.sendedAt = new Date()
                newDate.recievedAt = null
            } else {
                newDate.createdAt = shipping.createdAt
                newDate.sendedAt = shipping.sendedAt ?? new Date()
                newDate.recievedAt = new Date()
            }
            setDateState(newDate)
        }
    }

    const handleOnSubmit = async (values: any) => {

        if (shipping) {
            showLoading(true)

            const variables = {
                id: shipping.id,
                count: parseInt(values.count),
                content: values.contentType,
                from: values.from,
                to: values.to,
                status: values.status,
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

            <Space
                direction="vertical"
                align="center"
                style={{
                    width: '100%',
                }}
            >
                <Card
                    title={'Редактировать отправку'}
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
                        initialValues={{
                            contentType: shipping.contentType,
                            count: shipping.count,
                            from: shipping.fromId,
                            to: shipping.toId,
                            status: shipping.status
                        }}
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
                            <Input placeholder="Количество" autoComplete="off" />
                        </Form.Item>
                        <Form.Item
                            label="Отправитель"
                            name="from"
                            rules={[{ required: true, message: 'Выберете отправителя!' }]}
                        >
                            <Select
                                placeholder="Выберете отправителя"
                                options={places.map(x => ({ value: x.id, label: x.location }))}
                            />
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
                        <Form.Item
                            label="Статус"
                            name="status"
                            rules={[{ required: true, message: 'Выберете статус!' }]}
                        >
                            <Select
                                placeholder="Выберете статус"
                                options={statusList.map(x => ({ value: x.name, label: x.label }))}
                                onChange={(e) => onStatusChange(e)}
                            />
                        </Form.Item>
                        <Form.Item {...buttonItemLayout}>
                            <Button htmlType="submit" type="primary" loading={loading}>Сохранить</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Space>
        </>
    } else {
        return <></>
    }

}

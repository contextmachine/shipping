import { _Head } from "@/components"
import ShippingCard from "@/components/ShippingCard"
import Status from "@/components/Status"
import { useRouter } from "next/router"
import { useMutation, useQuery } from "@apollo/client"
import { parseShipping } from "@/graphql/parsers/parsers"
import { GET_SHIPPING, SEND, RECIEVE } from '@/graphql/queries'
import { Button, Card, Space } from "antd";
import { useLogin, useUser } from "@/components/hooks/useUser"


export default function CurrentStatus() {

    useLogin()
    const user = useUser()
    const router = useRouter()
    const { data } = useQuery(GET_SHIPPING, { variables: { 'id': router.query.id } })
    const [send] = useMutation(SEND)
    const [recieve] = useMutation(RECIEVE)

    const shipping = parseShipping(data)

    const shippingUpdate = async () => {
        if (shipping && shipping.status !== 'recieved') {

            if (shipping.status === 'created') {
                await send({
                    variables: {
                        id: shipping.id,
                        sendedAt: new Date().toISOString(),
                        status: 'sended'
                    }
                })
            } else if (shipping.status === 'sended') {
                await recieve({
                    variables: {
                        id: shipping.id,
                        recievedAt: new Date().toISOString(),
                        status: 'recieved'
                    }
                })
            }
            router.reload()
        }

    }

    if (shipping) {
        return <>
            <_Head title={`Shipping Status | ${shipping?.id}`} />
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

                    <div className="d-flex justify-content-center">
                        <div className="d-flex flex-column align-itmes-center mb-5" style={{ maxWidth: '380px' }}>
                            <ShippingCard shipping={shipping} showQr={false} />
                            <Status status={shipping.status} />
                            {shipping.status === 'created'
                                && user?.id === shipping.fromId
                                && <Button
                                    block
                                    type="primary"
                                    onClick={shippingUpdate}>
                                    Отправить
                                </Button>}
                            {shipping.status === 'sended'
                                && user?.id === shipping.toId
                                && <Button
                                    block
                                    type="primary"
                                    onClick={shippingUpdate}>
                                    Получить
                                </Button>}
                        </div>
                    </div>


                </Card>
            </Space>

        </>
    } else {
        return <> </>
    }
}

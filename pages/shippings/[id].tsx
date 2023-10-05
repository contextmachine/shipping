import { _Head } from "@/components";
import { useRouter } from "next/router";
import Link from 'next/link'
import { saveSticker } from "@/utils";
import ShippingCard from "@/components/ShippingCard";
import { useQuery } from "@apollo/client";
import { parseShipping } from "@/graphql/parsers/parsers";
import Status from "@/components/Status";
import { GET_SHIPPING } from '@/graphql/queries'
import { Button, Card, Form, Input, Space, Select } from "antd";
import { useLogin } from "@/components/hooks/useUser";

export default function PostDetails() {

    useLogin()
    const { query } = useRouter()
    const { data } = useQuery(GET_SHIPPING, { variables: { 'id': query.id } })
    const shipping = parseShipping(data)

    if (shipping) {
        return <>
            <_Head title={`Shipping | ${shipping.id}`} />

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
                            <ShippingCard shipping={shipping} showQr={true} />
                            <Status status={shipping.status}></Status>
                            <button type="submit" className="btn btn-primary w-100 mb-1" onClick={() => saveSticker(shipping.id)}>Сохранить</button>
                            <div className="d-flex w-100 align-items-center">
                                <Link href={`/shippings/status/${shipping.id}`} className="btn btn-secondary w-100">
                                    Статус (dev)
                                </Link>
                            </div>
                        </div>
                    </div>
                </Card>
            </Space>
        </>
    } else {
        return <> </>

    }
}





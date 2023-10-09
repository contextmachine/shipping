import { _Head } from "@/components"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import { User } from "../interfaces/UserInterface"
import { Button, Card, Dropdown, MenuProps, Space } from "antd"
import {
    UserOutlined,
    FileAddOutlined,
    LogoutOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import ShippingTable from "@/components/shippingTable/ShippingTable"
import LocationSummary from "@/components/summary/Summary"
import { useLogin, useUser } from "@/components/hooks/useUser"
import { Logistic } from "@/components/logistic/logistic"

const lahtaUserId = '4f5cf275-0964-4f8a-a5ad-f0140b429182'

const tabList = [
    {
        key: 'shippingList',
        label: 'Список отправок',
    },
    {
        key: 'summary',
        label: 'Сводка',
    },
    {
        key: 'logistic',
        label: 'Логистика',
    },
];

export default function Home() {

    useLogin()
    const user = useUser()
    const router = useRouter()

    const [activeTab, setActiveTab] = useState<string>('shippingList');

    const showSummary = useMemo(() => {
        return user?.role === 'admin' || user?.id === lahtaUserId
    }, [user])


    const userMenuItems: MenuProps['items'] = [
        {
            label: 'Список пользователей',
            key: '1',
            icon: <TeamOutlined />,
            onClick: () => {
                router.push('./users')
            }
        },
        {
            label: 'Выйти',
            style: {
                color: 'red'
            },
            key: '2',
            icon: <LogoutOutlined />,
            onClick: () => {
                router.push('./logout')
            }
        },
    ]


    return <>
        <_Head title="Список отправок" />

        <main >

            <Space
                direction="vertical"
                align="center"
                style={{
                    width: '100%',
                }}
            >
                {user &&
                    <Card
                        title={user?.location}
                        bordered={true}
                        style={{
                            width: '1280px',
                            margin: '50px',
                        }}
                        extra={<>
                            <Space.Compact >
                                <Button
                                    type='default'
                                    icon={<FileAddOutlined />}
                                    onClick={() => router.push('./shippings/create')}
                                >Создать отправку</Button>
                                <Dropdown menu={{ items: user.role === 'admin' ? userMenuItems : userMenuItems.splice(1, 2) }}>
                                    <Button type="default" icon={<UserOutlined />} />
                                </Dropdown>
                            </Space.Compact>
                        </>}

                        tabList={showSummary ? tabList : [tabList[0]]}
                        activeTabKey={activeTab}
                        onTabChange={setActiveTab}
                    >
                        {activeTab === 'shippingList' &&
                            <ShippingTable user={user as any} />
                        }
                        {activeTab === 'summary' &&
                            <LocationSummary />
                        }
                        {activeTab === 'logistic' &&
                            <Logistic />
                        }
                    </Card>
                }
            </Space>
        </main>
    </>
}




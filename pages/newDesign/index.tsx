import { _Head } from "@/components"
import { useRouter } from "next/router"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import ShippingList from "../../components/ShippingList"
import { useQuery } from "@apollo/client"
import { parseShippings } from "@/graphql/parsers/parsers"
import { User } from "../../interfaces/UserInterface"
import { Header } from "@/components/Header"
import { Shipping } from "@/interfaces/Shipping"
import { filterList, filterMap } from "@/utils/filterUtils"
import { GET_SHIPPINGS } from '@/graphql/queries'
import { Button, Card, Space, Tooltip } from "antd"
import {
    UserOutlined,
    FileAddOutlined,
    PieChartOutlined,
} from '@ant-design/icons';
import ShippingTable from "@/components/newDesign/ShippingTable"


const tabList = [
    {
        key: 'shippingList',
        label: 'Список отправок',
    },
    {
        key: 'summary',
        label: 'Сводка',
    },
];





export default function NewTable({ page, limit }: { page: string, limit: string }) {


    const router = useRouter()
    const [user, setUser] = useState<User>()
    const [isAdmin, setAdmin] = useState<boolean>(false)
    const [searchId, setSearchId] = useState<number>(NaN)
    const userFilterSelect = useRef<HTMLSelectElement>(null)
    const searchField = useRef<HTMLInputElement>(null)
    const [shippingList, setShippingList] = useState<Shipping[]>([])
    const [currentFilter, setCurrentFilter] = useState('all')

    const [showSummaryButton, setShowSummaryButton] = useState(false)

    const { data: shippingsData, loading: shippingListLoading } = useQuery(GET_SHIPPINGS)


    const [activeTab, setActiveTab] = useState<string>('shippingList');
    const tabChange = (key: string) => {
        setActiveTab(key);
    };

    useEffect(() => {
        if (user) {
            const userFilter = filterMap.get(currentFilter)
            if (userFilter) {
                const shippings = parseShippings(shippingsData)

                let filtered: Shipping[]
                if (isAdmin) {
                    filtered = shippings.filter(x => userFilter(x, user.id as string))
                } else {
                    filtered = shippings
                        .filter(x => x.toId === user.id || x.fromId === user.id)
                        .filter(x => userFilter(x, user.id as string))
                }
                setShippingList(filtered)
            } else {
                setShippingList(parseShippings(shippingsData))
            }
        }
    }, [currentFilter, isAdmin, searchId, shippingsData, user])


    useEffect(() => {
        const shippings = parseShippings(shippingsData)

        if (isNaN(searchId)) {
            if (searchField && searchField.current) {
                searchField.current.value = ''
            }
        } else {
            const filtered = shippings.filter(shipping =>
                shipping.number.toString().startsWith(searchId.toString())
            )
            setShippingList(filtered)
        }
    }, [searchId, shippingsData])

    const handleOnChangeFilter = () => {
        if (userFilterSelect.current) {
            setCurrentFilter(userFilterSelect.current.value)
            setSearchId(NaN)
        }
    }

    const handleSearch = () => {
        if (searchField.current) {
            const value = parseInt(searchField.current.value)
            setSearchId(value)
            setCurrentFilter('all')
        }
    }


    useEffect(() => {
        const user = (JSON.parse(localStorage.getItem('user') as string) as User)
        const lahtaUserId = '4f5cf275-0964-4f8a-a5ad-f0140b429182'
        setAdmin(user?.role === 'admin')
        setUser(user)
        setShowSummaryButton(user?.role === 'admin' || user?.id === lahtaUserId)

        if (!localStorage.getItem('user')) {
            router.push('/login')
        }
    }, [router])


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
                <Card
                    title={user?.location}
                    bordered={true}
                    style={{
                        width: '1280px',
                        margin: '50px',
                    }}
                    extra={<>
                        <Space.Compact                    >
                            <Button type='default' icon={<FileAddOutlined />}>Создать отправку</Button>
                            <Button type="default" icon={<UserOutlined />} />
                        </Space.Compact>
                    </>}

                    tabList={tabList}
                    activeTabKey={activeTab}
                    onTabChange={tabChange}
                >
                    {activeTab === 'shippingList' &&
                        <ShippingTable
                        />
                    }
                    {activeTab === 'summary' &&
                        < p > Сводка</p>
                    }
                </Card>



            </Space>


            <div className="container mt-3">
                <Header>
                    <Link href="/shippings/create" className="btn text-w btn-sm btn-primary mx-1 flex-nowrap" >
                        Создать отправку
                    </Link>
                    {isAdmin && <Link href="/users" className="btn text-w btn-sm btn-primary mx-1 flex-nowrap" >
                        Пользователи
                    </Link>}
                    {showSummaryButton && <Link href="/location-summary" className="btn text-w btn-sm btn-primary mx-1 flex-nowrap" >
                        Сводка
                    </Link>}
                    <Link href="/logout" className="btn btn-sm btn-danger mx-1 align-middle">Выйти</Link>
                </Header>
                <ShippingList
                    searchId={searchId}
                    loading={shippingListLoading}
                    userFilter={currentFilter}
                    shippings={shippingList}
                    user={user?.id ? user.id : ''}
                    isAdmin={isAdmin}
                    page={parseInt(page)}
                    limit={parseInt(limit)} />
            </div>

        </main>
    </>
}

export async function getServerSideProps({ query: { page = 1, limit = 50 } }) {

    return {
        props: {
            page: page,
            limit: limit
        }
    }
}






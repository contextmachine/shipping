import { Shipping } from "../../interfaces/Shipping";
import { Space, Table } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_SHIPPING, GET_SHIPPINGS } from "@/graphql/queries";
import { useEffect, useMemo, useState } from "react";
import { parseShippings } from "@/graphql/parsers/parsers";
import { TableFilters } from "./filters/Filters";
import { User } from '@/interfaces/UserInterface';
import { useRouter } from 'next/router';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { DataType, initialColumns } from "./columns";
import { useUser } from "../hooks/useUser";

export interface ShippintTableProps {
    user: User
}

export default function ShippingTable(props: ShippintTableProps) {

    const router = useRouter()
    const { data: shippingData, loading: shippingListLoading } = useQuery(GET_SHIPPINGS)

    const [tableData, setTableData] = useState<DataType[]>([])
    const [filtered, setFiltered] = useState<Shipping[]>([])

    const [deleteShipping] = useMutation(DELETE_SHIPPING,
        { refetchQueries: [GET_SHIPPINGS] }
    )

    const shippings = useMemo(() => {
        return parseShippings(shippingData)
    }, [shippingData])


    const user = useUser()

    useEffect(() => {

        const handleOnDelete = async (id: string) => {
            if (!confirm("Are you sure you want to delete this post ?")) { return }
            await deleteShipping({
                variables: {
                    id: id
                }
            })
        }
        const actionsColumn = initialColumns.find(x => x.key === 'actions')!
        actionsColumn.render = (text, record) => {
            return <> {user?.role === 'admin' &&
                <Space direction="horizontal">
                    <EditOutlined type='button' style={{ color: "gray" }} onClick={() => router.push(`/shippings/edit/${record.uuid}`)} />
                    <DeleteOutlined type='button' style={{ color: "gray" }} onClick={() => handleOnDelete(record.uuid)} />
                </Space>
            }
            </>
        }
    }, [deleteShipping, router, user])



    useEffect(() => {
        console.log('data', filtered)
        setTableData(shippigDataToTableData(filtered))
    }, [filtered])

    return <>
        <TableFilters
            user={props.user}
            shippings={shippings}
            setFiltered={setFiltered}
        />
        <br />
        <Table
            tableLayout='fixed'
            loading={shippingListLoading}
            columns={initialColumns}
            dataSource={tableData}
            pagination={{ pageSize: 50, showSizeChanger: false }}
            size='small'
        />
    </>
}



const shippigDataToTableData = (data: Shipping[]): DataType[] => {


    const tableData: DataType[] = data.map(shipping => {
        return {
            uuid: shipping.id,
            key: shipping.id,
            id: shipping.number,
            status: shipping.status,
            contentType: shipping.contentType,
            count: shipping.count,
            from: shipping.from,
            to: shipping.to,
            createdAt: shipping.createdAt,
            sendedAt: shipping.sendedAt,
            recievedAt: shipping.recievedAt,
        }
    })

    return tableData

}
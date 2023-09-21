import { Shipping } from "../../interfaces/Shipping";
import { SortValue } from "@/components/SortButton";
import { Badge, Table, Tag } from "antd";
import { parseShippings } from "@/graphql/parsers/parsers"

export interface ShippintTableProps {
}

export interface TableFilter {
    field: string,
    value: any
}

export type TableFilters = Map<string, any>

export interface SortState {
    field: string,
    value: SortValue
}

import type { ColumnsType, TableProps } from 'antd/es/table';
import { useQuery } from "@apollo/client";
import { GET_SHIPPINGS } from "@/graphql/queries";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils";
import { columnFilterMap, columnFilterMap2 } from "@/utils/filterUtils";
import { DateRange } from "@/utils/types";
import { ColumnFilterItem, ColumnType } from "antd/es/table/interface";
import { statusMap } from "../Status";


interface DataType {
    key: string
    id: number,
    status: string
    contentType: string
    count: number
    from: string
    to: string
    createdAt: string
    sendedAt: string
    recievedAt: string
}

const initialColumns: ColumnsType<DataType> = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '100px',
        defaultSortOrder: 'descend',
        align: 'center',
    },
    {
        title: 'Статус',
        dataIndex: 'status',
        key: 'status',
        width: '110px',
        defaultSortOrder: 'descend',
        align: 'center',
        render: (text, record, index) => {
            return <>
                {text === 'created' && <Tag color='processing' key={text}>Создан</Tag>}
                {text === 'sended' && <Tag color='warning' key={text}>Отправлен</Tag>}
                {text === 'recieved' && <Tag color='success' key={text}>Доставлен</Tag>}
            </>
        }
    },
    {
        title: 'Контент',
        dataIndex: 'contentType',
        key: 'contentType',
        width: '110px',
        defaultSortOrder: 'descend',
        align: 'center',
    },
    {
        title: 'Кол-во',
        dataIndex: 'count',
        key: 'count',
        width: '110px',
        defaultSortOrder: 'descend',
        align: 'center',
    },
    {
        title: 'Откуда',
        dataIndex: 'from',
        key: 'from',
        width: '150px',
        defaultSortOrder: 'descend',
        align: 'center',
    },
    {
        title: 'Куда',
        dataIndex: 'to',
        key: 'to',
        width: '150px',
        defaultSortOrder: 'descend',
        align: 'center',
    },
    {
        title: 'Создан',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: '90px',
        defaultSortOrder: 'descend',
        align: 'center',
    },
    {
        title: 'Отправлен',
        dataIndex: 'sendedAt',
        key: 'sendedAt',
        width: '90px',
        defaultSortOrder: 'descend',
        align: 'center',
    },
    {
        title: 'Получен',
        dataIndex: 'recievedAt',
        key: 'recievedAt',
        width: '90px',
        defaultSortOrder: 'descend',
        align: 'center',
    },

];


const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
};

const shippigDataToTableData = (data: Shipping[]): DataType[] => {

    const tableData: DataType[] = data.map(shipping => {
        return {
            key: shipping.id,
            id: shipping.number,
            status: shipping.status,
            contentType: shipping.contentType,
            count: shipping.count,
            from: shipping.from,
            to: shipping.to,
            createdAt: formatDate(shipping.createdAt),
            sendedAt: formatDate(shipping.sendedAt),
            recievedAt: formatDate(shipping.recievedAt),
        }
    })

    return tableData

}


export default function ShippingTable(props: ShippintTableProps) {

    const [tableData, setTableData] = useState<DataType[]>([])
    const { data: shippingsData, loading: shippingListLoading } = useQuery(GET_SHIPPINGS)

    const [columns, setColumns] = useState<ColumnsType<DataType>>(initialColumns)


    useEffect(() => {
        const shippings = parseShippings(shippingsData)
        setTableData(shippigDataToTableData(shippings))
    }, [shippingsData])


    useEffect(() => {

        const newColumns: ColumnsType<DataType> = initialColumns.map(column => {

            let filters: ColumnFilterItem[] | undefined = undefined

            if (['status', 'contentType', 'from', 'to'].includes(column.key as string)) {
                const uniqueValues = new Set(tableData
                    .map(x => Object.entries(x).find(([key, _]) => key === column.key)!)
                    .map(([_, value]) => value))

                filters = [...uniqueValues].map(value => ({
                    value: value, text: column.key === 'status'
                        ? statusMap.get(value)
                        : value
                }));


                (filters as any[]).sort((a, b) => a.value.localeCompare(b.value))
            }


            const newColumn = {
                filters: filters,
                onFilter: columnFilterMap2.get(column.key! as string) as (value: string | number | boolean) => boolean,
                ...column,
            }

            return newColumn
        })

        setColumns(newColumns)



    }, [tableData])


    useEffect(() => {
    }, [shippingListLoading])

    return <>

        <Table
            loading={shippingListLoading}
            columns={columns}
            dataSource={tableData}
            onChange={onChange}
            pagination={{ pageSize: 50 }}
            size='small'

        />


    </>
}


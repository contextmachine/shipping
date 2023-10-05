import { dateComapare, formatDate } from "@/utils"
import { ColumnsType } from "antd/es/table"
import Link from "next/link"
import Status, { statusMap } from "../Status"

export interface DataType {
    uuid: string,
    key: string
    id: number,
    status: string
    contentType: string
    count: number
    from: string
    to: string
    createdAt: Date | undefined
    sendedAt: Date | undefined
    recievedAt: Date | undefined
}

export const initialColumns: ColumnsType<DataType> = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        // width: '100px',
        width: '8.16%',
        align: 'center',
        sorter: (a, b) => b.id - a.id
    },
    {
        title: 'Статус',
        dataIndex: 'status',
        key: 'status',
        // width: '110px',
        width: '8.16%',
        align: 'center',
        sorter: (a, b) => statusMap.get(a.status)!.sortValue - statusMap.get(b.status)!.sortValue,
        render: (text, record, index) => {
            return <><Link href={`./shippings/${record.uuid}`} style={{ textDecoration: 'none' }}>
                <Status status={text} />
            </Link>
            </>
        }
    },
    {
        title: 'Контент',
        dataIndex: 'contentType',
        key: 'contentType',
        // width: '110px',
        width: '8.16%',
        align: 'center',
        sorter: (a, b) => a.contentType.localeCompare(b.contentType),
    },
    {
        title: 'Кол-во',
        dataIndex: 'count',
        key: 'count',
        // width: '110px',
        width: '8.16%',
        align: 'center',
        sorter: (a, b) => b.count - a.count,
    },
    {
        title: 'Откуда',
        dataIndex: 'from',
        key: 'from',
        width: '12.46%',
        // width: '150px',
        align: 'center',
        sorter: (a, b) => a.from.localeCompare(b.from),
    },
    {
        title: 'Куда',
        dataIndex: 'to',
        key: 'to',
        width: '12.46%',
        // width: '150px',
        align: 'center',
        sorter: (a, b) => a.to.localeCompare(b.to),
    },
    {
        title: 'Создан',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: '12.46%',
        // width: '90px',
        align: 'center',
        sorter: (a, b) => dateComapare(b.createdAt, a.createdAt),
        render: (_, record) => formatDate(record.createdAt)
    },
    {
        title: 'Отправлен',
        dataIndex: 'sendedAt',
        key: 'sendedAt',
        width: '12.46%',
        // width: '90px',
        align: 'center',
        sorter: (a, b) => dateComapare(b.sendedAt, a.sendedAt),
        render: (_, record) => formatDate(record.sendedAt)
    },
    {
        title: 'Получен',
        dataIndex: 'recievedAt',
        key: 'recievedAt',
        width: '12.46%',
        // width: '90px',
        align: 'center',
        sorter: (a, b) => dateComapare(b.recievedAt, a.recievedAt),
        render: (_, record) => formatDate(record.recievedAt)
    },
    {
        title: '',
        dataIndex: 'actions',
        key: 'actions',
        width: '4.08%',
        // width: '90px',
        align: 'center',
    }
];

export const spans: number[] = [2, 2, 2, 2, 3, 3, 3, 3, 3, 1]

export const columnMap = new Map(initialColumns.map((x) => ([x.key, x])))


export const dateForTableCell = (text: string) => {
    const lines = text.split(' ')
    if (lines.length === 2) {
        return <>
            <div>{lines[0]}</div>
            <div>{lines[1]}</div>
        </>
    } else {
        return <>-</>
    }
}




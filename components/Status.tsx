import { Tag } from "antd"

export const statusList = [{
    name: 'created',
    label: 'Создан',
    color: 'processing',
    hexColor: '#417afc',
    hexColorBg: '#e9f4ff',
    sortValue: 0,
},
{
    name: 'sended',
    label: 'Отправлен',
    color: 'warning',
    hexColor: '#efad2a',
    hexColorBg: '#fefbe7',
    sortValue: 1,
},
{
    name: 'recieved',
    label: 'Доставлен',
    color: 'success',
    hexColor: '#6cc12a',
    hexColorBg: '#f7ffed',
    sortValue: 2,
}]


export const statusMap = new Map(statusList.map(x => ([x.name, x])))
export const statusColorMap = new Map(statusList.map(x => ([x.name, x.color])))

export default function Status(props: { status: string }) {
    const { status } = props
    return <>
        <div className="d-flex justify-content-center mb-2" >
            {status === 'created' && <Tag color='processing' key={status}>Создан</Tag>}
            {status === 'sended' && <Tag color='warning' key={status}>Отправлен</Tag>}
            {status === 'recieved' && <Tag color='success' key={status}>Доставлен</Tag>}
        </div>
    </>
}
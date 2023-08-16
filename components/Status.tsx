import styles from "./Status.module.scss"

export const statusList = [{
    name: 'created',
    label: 'Создан',
    color: '#7FDBDA',
},
{
    name: 'sended',
    label: 'Отправлен',
    color: '#EDE682',
},
{
    name: 'recieved',
    label: 'Доставлен',
    color: '#ADE498'
}]

export const statusMap = new Map(statusList.map(x => ([x.name, x.label])))
export const statusColorMap = new Map(statusList.map(x => ([x.name, x.color])))

export default function Status(props: { status: string }) {
    return <>
        <div className={`${styles.status}`} title={props.status}>
            <span>{statusList.find(x => x.name === props.status)?.label}</span>
        </div>
    </>
}
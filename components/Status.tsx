import styles from "./Status.module.scss"

export const statusList = [{
    name: 'created',
    label: 'Создан'
},
{
    name: 'sended',
    label: 'Отправлен'
},
{
    name: 'recieved',
    label: 'Получен'
}]

export default function Status(props: { status: string }) {
    return <>
        <div className={`${styles.status}`} title={props.status}>
            <span>{statusList.find(x => x.name === props.status)?.label}</span>
        </div>
    </>
}
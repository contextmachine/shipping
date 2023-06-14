import styles from "./Status.module.scss"


export default function Status(props: { status: string }) {
    return <>
        <div className={`${styles.status}`} title={props.status}>
            <span>{props.status}</span>
        </div>
    </>
}
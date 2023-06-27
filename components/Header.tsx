import { User } from "@/interfaces/UserInterface"
import { useEffect, useState } from "react"


interface CurrentUserProps {
    children?: React.ReactNode
}

export function Header(props: CurrentUserProps) {

    const [user, setUser] = useState<User>()

    useEffect(() => {
        const user = (JSON.parse(localStorage.getItem('user') as string) as User)
        setUser(user)
    }, [])

    return <>
        <span
            className="d-flex w-100 flex-direction-row justify-content-between align-items-center mb-5"
            style={{ height: '80px', background: '#ececec', padding: '20px', borderRadius: '10px' }}>
            <p style={{ fontSize: "14pt", margin: '0' }}>{user?.location}</p>
            <div style={{ whiteSpace: "nowrap" }}>
                {props.children}
            </div>
        </span>
    </>
}
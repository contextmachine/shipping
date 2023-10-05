import { User } from "@/interfaces/UserInterface"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"


export const useUser = () => {

    const [user, setUser] = useState<User | undefined>(undefined)

    useEffect(() => {
        let user: User | undefined
        const userStr = localStorage.getItem('user')
        if (userStr) {
            user = JSON.parse(userStr)
            setUser(user)
        }

    }, [])

    return user

}


export const useAdminOnly = () => {
    const router = useRouter()


    useEffect(() => {
        const userStr = localStorage.getItem('user')

        if (!userStr) {
            router.push('/login')
        } else {
            const user: User = JSON.parse(userStr)
            if (user.role !== 'admin') {
                router.push('/')
            }
        }
    }, [router])

}

export const useLogin = () => {
    const router = useRouter()

    useEffect(() => {
        if (!localStorage.getItem('user')) {
            router.push('/login')
        }
    }, [router])

}
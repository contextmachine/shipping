import { Shipping } from "@/interfaces/Shipping"
import { User } from "@/interfaces/UserInterface"
import { UserFilterFunction, userFilterList, userFilterMap, UserFilterOption } from "@/utils/filterUtils"
import { FilterFilled } from "@ant-design/icons"
import { Select } from "antd"
import { useEffect, useMemo, useState } from "react"


interface UserFilterProps {
    user: User,
    userFilters: UserFilterFunction[],
    setUserFilters: (e: UserFilterFunction[]) => void
}


export function UserFilter(props: UserFilterProps) {

    const { setUserFilters, user } = props
    const [state, setState] = useState('all')

    useEffect(() => {
        const defaultUserFilter = (shipping: Shipping, userId: string) => shipping.toId === userId || shipping.fromId === userId

        const filters = []
        if (user.role !== 'admin') {
            console.log('def filter')
            filters.push(defaultUserFilter)
        }
        filters.push(userFilterMap.get(state)!)
        setUserFilters(filters)

    }, [setUserFilters, state, user])




    

    return <>
        <Select
            suffixIcon={<FilterFilled />}
            defaultValue="all"
            style={{ width: 200 }}
            onChange={(_, option) => setState((option as UserFilterOption).value)}
            options={userFilterList}
            value={state}
        />
        <br />
        <br />
    </>
}
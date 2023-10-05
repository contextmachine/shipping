import { Shipping } from "@/interfaces/Shipping"
import { UserFilterFunction, userFilterList, userFilterMap, UserFilterOption } from "@/utils/filterUtils"
import { FilterFilled } from "@ant-design/icons"
import { Select } from "antd"
import { useState } from "react"


interface UserFilterProps {
    userFilters: UserFilterFunction[],
    setUserFilters: (e: UserFilterFunction[]) => void
}


export function UserFilter(props: UserFilterProps) {

    const { setUserFilters } = props
    const [state, setState] = useState('all')

    const handleOnChangeFilter = (option: UserFilterOption) => {
        setState(option.value)
        setUserFilters([
            (shipping: Shipping, userId: string) => {
                return shipping.toId === userId || shipping.fromId === userId
            },
            userFilterMap.get(option.value)!
        ])

    }

    return <>
        <Select
            suffixIcon={<FilterFilled />}
            defaultValue="all"
            style={{ width: 200 }}
            onChange={(_, option) => handleOnChangeFilter(option as UserFilterOption)}
            options={userFilterList}
            value={state}
        />
        <br />
        <br />
    </>
}
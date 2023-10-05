import { SearchOutlined } from "@ant-design/icons"
import { Input } from "antd"
import { ChangeEvent } from "react"


interface SearchIdProps {
    searchId: number | undefined,
    setSearchId: (e: number | undefined) => void

}


export function SearchId(props: SearchIdProps) {

    const { searchId, setSearchId } = props

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {

        const value = e.target.value
        let searchId: number | undefined = parseInt(value)

        if (value === '' || isNaN(searchId)) {
            searchId = undefined
        }
        setSearchId(searchId)
    }


    return <>
        <Input
            size="small"
            allowClear
            suffix={<SearchOutlined style={{ color: 'lightgray', width: "12px", height: "12px" }} />}
            placeholder="ID"
            onChange={(e) => handleChange(e)}
            value={searchId ? searchId : ''}
        />
    </>
}
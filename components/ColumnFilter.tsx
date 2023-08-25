import { useRef } from "react"
import { TableFilter, TableFilters } from "./ShippingList"


export interface Param {
    value: string,
    label: string
}


export interface ColumnFilterProps {
    field: string
    params: Param[],
    columnFilter: TableFilters,
    setColumnFilter: (e: TableFilters) => void
}


export function ColumnFilter(props: ColumnFilterProps) {

    const { params, columnFilter, setColumnFilter, field } = props
    const filter = useRef<HTMLSelectElement>(null)

    const handleOnChange = (value: string) => {
        columnFilter.set(field, value)
        const newMap = new Map([...columnFilter])
        setColumnFilter(newMap)
    }

    return <>
        <div className="mb-3" >
            <select
                className="justify-self-center"
                style={{ border: '0', fontWeight: 'normal' }}
                ref={filter}
                value={columnFilter.get(field)}
                onChange={(e) => handleOnChange(e.target.value)}>

                <option value={'none'}>нет</option>
                {params.map((x, i) => (<option key={i} value={x.value}> {x.label} </option>))}
            </select>
        </div>
    </>
}
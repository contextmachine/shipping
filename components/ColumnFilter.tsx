import { useRef } from "react"
import { TableFilter } from "./ShippingList"


export interface Param {
    value: string,
    label: string
}


export interface ColumnFilterProps {
    field: string
    params: Param[],
    columnFilter: TableFilter,
    setColumnFilter: (e: TableFilter) => void
}


export function ColumnFilter(props: ColumnFilterProps) {

    const { params, columnFilter, setColumnFilter, field } = props
    const filter = useRef<HTMLSelectElement>(null)

    const handleOnChange = (value: string) => {
        setColumnFilter({ field: field, value: value })
    }

    return <>
        <div className="mb-3" >
            <select
                style={{ border: '0', fontWeight: 'normal' }}
                ref={filter}
                value={columnFilter.field === field ? columnFilter.value : 'none'}
                onChange={(e) => handleOnChange(e.target.value)}>

                <option value='none'>нет</option>
                {params.map((x, i) => (<option key={i} value={x.value}> {x.label} </option>))}
            </select>

        </div>
    </>
}
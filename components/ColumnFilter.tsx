import { useEffect, useRef, useState } from "react"
import styles from "./ColumnFilter.module.css"
import { TableFilter } from "./ShippingList"

export interface ColumnFilterProps {
    field: string
    params: string[],
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
        <div
            className="d-flex">
            <i className="bi bi-sm bi-funnel-fill text-gray" />
            <select
                className="d-inline-flex"
                style={{ border: '0' }}
                ref={filter}
                value={columnFilter.field === field ? columnFilter.value : 'none'}
                onChange={(e) => handleOnChange(e.target.value)}>

                <option value='none'>нет</option>
                {params.map((x, i) => (<option key={i}> {x} </option>))}
            </select>

        </div>
    </>
}
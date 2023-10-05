import { statusMap } from "@/components/Status"
import { Shipping } from "@/interfaces/Shipping"
import { Select } from "antd"
import { useEffect, useState } from "react"
import { Filters } from "./Filters"


export type ColumnFilter = (shipping: Shipping) => boolean

export interface Param {
    filter: ColumnFilter,
    value: any,
    label: string
}

export interface ColumnFilterProps {
    columnKey: string,
    shippings: Shipping[],
    filters: Filters,
    setFilters: (e: Filters) => void,
}

export function ColumnFilter(props: ColumnFilterProps) {

    const { columnKey, shippings, filters, setFilters } = props
    const [params, setParams] = useState<Param[]>([])

    const [thisFilters, setThisFilters] = useState<Param[]>([])

    useEffect(() => {

        const params = Array.from(
            new Set(shippings.map(shipping => shipping[columnKey as keyof Shipping])).values()
        ).map(x => {
            const value = x as string
            const result = {
                key: value,
                value: value,
                label: columnKey === 'status' ? statusMap.get(value)!.label : value,
                filter: (shipping: Shipping) => shipping[columnKey as keyof Shipping] === x,
            }
            return result
        })

        setParams(params)
        statusMap

    }, [columnKey, shippings])


    useEffect(() => {
        if (filters.get(columnKey) === undefined) {
            setThisFilters([])
        }
    }, [columnKey, filters])


    const onChange = (params: Param[]) => {
        setThisFilters(params)
        const newFilters = new Map([...filters.entries()])
        newFilters.set(columnKey, params.map(x => x.filter))
        setFilters(newFilters)
    }




    return <>
        <Select
            style={{ width: '100%' }}
            mode="multiple"
            allowClear
            maxTagTextLength={3}
            size='small'
            placeholder="нет"
            onChange={(_, option) => onChange(option as Param[])}
            value={thisFilters}
            options={params}
        />
    </>
}
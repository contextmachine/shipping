import { Shipping } from "@/interfaces/Shipping";
import { dateInRange } from "@/utils";
import { DatePicker, TimeRangePickerProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { ColumnFilter } from "./ColumnFilter";
import { Filters } from "./Filters";

const { RangePicker } = DatePicker


export interface DateFilterProps {
    columnKey: string,
    filters: Filters,
    setFilters: (e: Filters) => void,
}


export default function DateFilter(props: DateFilterProps) {

    const { columnKey, filters, setFilters } = props
    const [value, setValue] = useState<[Dayjs | null, Dayjs | null] | null>(null)


    const rangePresets: TimeRangePickerProps['presets'] = [
        { label: 'Вчера', value: [dayjs().add(-1, 'd').startOf('day'), dayjs().add(-1, 'd').endOf('day')] },
        { label: 'Сегодня', value: [dayjs().startOf('day'), dayjs().endOf('day')] },
        { label: 'Последние 7 дней', value: [dayjs().add(-6, 'd').startOf('day'), dayjs().endOf('day')] },
    ];

    useEffect(() => {


        const bounds = value
        let thisFilters: ColumnFilter[] | undefined = undefined

        if (bounds) {

            const [min, max] = bounds

            if (min && max) {

                thisFilters = [
                    (shipping: Shipping) => {
                        const date = shipping[columnKey as keyof Shipping] as Date | undefined
                        if (!date) {
                            return false
                        } else {
                            return dateInRange(date, [min, max]) as boolean
                        }
                    }
                ]
            }
        }

        const newFilters = new Map([...filters.entries()])
        newFilters.set(columnKey, thisFilters)
        setFilters(newFilters)



    }, [columnKey, setFilters, value])

    useEffect(() => {
        if (filters.get(columnKey) === undefined) {
            setValue(null)
        }
    }, [columnKey, filters])


    return <RangePicker
        size='small'
        placeholder={['нет', '']}
        format="DD.MM.YY"
        separator={<div>-</div>}
        onChange={(e, _) => setValue(e)}
        presets={rangePresets}
        value={value}
    />
}
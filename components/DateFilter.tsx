import { DateRange } from "@/utils/types";
import { DateRangePicker } from "rsuite";
import { startOfDay, endOfDay, addDays, subDays } from 'date-fns';
import { RangeType } from "rsuite/esm/DatePicker";
import 'rsuite/dist/rsuite-no-reset.min.css';
import { ColumnFilterProps } from "./ColumnFilter";
import { useState } from "react";
import { TableFilter } from "./ShippingList";

const getRanges = (now: Date): RangeType<DateRange>[] => [
    {
        label: 'Сегодня',
        value: [startOfDay(now), endOfDay(now)]
    },
    {
        label: 'Вчера',
        value: [startOfDay(addDays(now, -1)), endOfDay(addDays(now, -1))]
    },
    {
        label: 'Последние 7 дней',
        value: [startOfDay(subDays(now, 6)), endOfDay(now)]
    }
]

export interface DateFilterProps {
    field: string
    columnFilter: TableFilter,
    setColumnFilter: (e: TableFilter) => void
}


export default function DateFilter(props: DateFilterProps) {

    const { columnFilter, setColumnFilter, field } = props

    const handleOnChange = (value: DateRange | null) => {
        setColumnFilter({ field: field, value: value })
    }

    const ranges = getRanges(new Date())

    return <div className="mb-3">
        <DateRangePicker
            size='xs'
            placeholder={'нет'}
            showOneCalendar={true}
            value={columnFilter.field === field ? columnFilter.value as DateRange : null}
            onChange={handleOnChange}
            format="dd.MM.yy"
            ranges={ranges as any}
        ></DateRangePicker>
    </div>
}
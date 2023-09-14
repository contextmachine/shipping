import { DateRange } from "@/utils/types";
import { ColumnFilterProps } from "./ColumnFilter";
import { useState } from "react";
import { TableFilter, TableFilters } from "./ShippingList";
import { DatePicker, TimeRangePickerProps } from "antd";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker



export interface DateFilterProps {
    field: string
    columnFilter: TableFilters,
    setColumnFilter: (e: TableFilters) => void
}


export default function DateFilter(props: DateFilterProps) {

    const { columnFilter, setColumnFilter, field } = props


    const rangePresets: TimeRangePickerProps['presets'] = [
        { label: 'Вчера', value: [dayjs().add(-1, 'd').startOf('day'), dayjs().add(-1, 'd').endOf('day')] },
        { label: 'Сегодня', value: [dayjs().startOf('day'), dayjs().endOf('day')] },
        { label: 'Последние 7 дней', value: [dayjs().add(-6, 'd').startOf('day'), dayjs().endOf('day')] },
    ];

    const handleOnChange = (dates: [Dayjs | null, Dayjs | null] | null) => {

        if (dates && dates[0] && dates[1]) {
            columnFilter.set(field, [dates[0].startOf('day'), dates[1].endOf('day')])
        } else {
            columnFilter.set(field, 'none')
        }
        const newMap = new Map([...columnFilter])
        setColumnFilter(newMap)

    }


    return <div className="mb-3">

        <RangePicker
            size='small'
            placeholder={['нет', '']}
            format="DD.MM.YY"
            onChange={(e, _) => handleOnChange(e)}
            presets={rangePresets}
            value={columnFilter.get(field) === 'none' ? null : columnFilter.get(field)}
        />
    </div>
}